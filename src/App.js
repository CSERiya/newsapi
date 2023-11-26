import './App.css';
import React,{useState} from 'react'
import Navbar from './Components/Navbar';
import NewsComp from './Components/NewsComp';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
const App=()=> { 
  const apiKey=process.env.REACT_APP_NEWS_API
 
 const [progress,setProgress]=useState(0)
    return (
      <BrowserRouter>   
      <>
        <Navbar/>
        <LoadingBar
        color='#f11946'
        height='3px'
        progress={progress} 
          
      />
        <Routes>
          <Route exact path="/" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="general" category="general"/>}/>
          <Route exact path="/business" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="business" category="business"/>}/>
          <Route exact path="/entertainment" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="entertainment" category="entertainment"/>}/>
          <Route exact path="/general" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="general" category="general"/>}/>
          <Route exact path="/health" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="health" category="health"/>}/>
          <Route exact path="/science" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="science" category="science"/>}/>
          <Route exact path="/sports" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="sports" category="sports"/>}/>
          <Route exact path="/technology" element={<NewsComp setProgress={setProgress}  apiKey={apiKey} key="technology" category="technology"/>}/>
        </Routes>
      </>
</BrowserRouter>      

    )
  }
export default App;