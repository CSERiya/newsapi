import React, { useEffect, useState } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import PropTypes from 'prop-types';

const NewsComp = (props) => {  
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [filteredArticles, setFilteredArticles] = useState([]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const fetchAllArticles = async () => {
        if (!props.apikey) {
            console.error("API key is missing or invalid.");
            return;
        }

        props.setProgress(10);
        let allArticles = [];
        let currentPage = 1;
        let totalFetchedArticles = 0;
        const maxArticles = 10;

        try {
            while (totalFetchedArticles < maxArticles) {
                const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&apikey=31b9e303d2017fdc35701f878d52610c&page=${currentPage}&pageSize=${maxArticles - totalFetchedArticles}`;

                let data = await fetch(url);
                props.setProgress(30);
                let parsedData = await data.json();
                props.setProgress(70);
                allArticles = allArticles.concat(parsedData.articles || []);
                totalFetchedArticles += parsedData.articles.length;
                if (totalFetchedArticles >= parsedData.totalResults || parsedData.articles.length === 0) {
                    break;
                }

                currentPage++;
            }

            setArticles(allArticles.slice(0, maxArticles));
            setTotalResults(allArticles.length);
            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error("Error fetching the news data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = `NewsHub - ${capitalizeFirstLetter(props.category)}`;
        fetchAllArticles();
    }, [props.category, props.country, props.apiKey]);

    useEffect(() => {
        if (props.searchQuery) {
            const searchQuery = props.searchQuery.toLowerCase();
            const filtered = articles.filter(article => {
                const title = article.title ? article.title.toLowerCase() : '';
                const description = article.description ? article.description.toLowerCase() : '';
                return title.includes(searchQuery) || description.includes(searchQuery);
            });
            setFilteredArticles(filtered);
            setTotalResults(filtered.length);
        } else {
            setFilteredArticles(articles);
            setTotalResults(articles.length);
        }
    }, [props.searchQuery, articles]);

    const handleNextClick = () => {
        setPage(page + 1);
    };

    const handlePrevClick = () => {
        setPage(page - 1);
    };

    const highlightText = (text, searchQuery) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
        );
    };

    const startIndex = (page - 1) * props.pageSize;
    const endIndex = startIndex + props.pageSize;
    const displayedArticles = filteredArticles.slice(startIndex, endIndex);

    return (
        <>
            <style>
                {`
                    .highlight {
                        background-color: rgba(13, 110, 253, 0.3);
                        font-weight: bold;
                    }
                `}
            </style>

            <h1 className="text-center" style={{marginTop:'120px'}}>NewsHub - Trending {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <div className="container">
                <div className="row">
                    {displayedArticles.length > 0 ? (
                        displayedArticles.map((element, index) => (
                            <div className="col-md-4" key={index}>
                                <NewsItems
                                    title={highlightText(element.title ? element.title : '', props.searchQuery)}
                                    description={highlightText(element.description ? element.description : '', props.searchQuery)}
                                    imageUrl={element.image}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        ))
                    ) : (
                        !loading && <div className="col-12">
                            <h3 className="text-center">No records found</h3>
                        </div>
                    )}
                </div>
            </div>
            <div className="container d-flex justify-content-between my-4">
                <button disabled={page <= 1} className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
                <button disabled={endIndex >= totalResults} className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
            </div>
            {!loading && displayedArticles.length === 0 && <div className="text-center mt-3">
                <h5 style={{marginTop:'-100px'}}>No more news related to your search.</h5>
            </div>}
        </>
    );
};

NewsComp.defaultProps = {
    country: 'in',
    pageSize: 9,
    category: 'general',
    searchQuery: '',
};

NewsComp.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    searchQuery: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired
};

export default NewsComp;
