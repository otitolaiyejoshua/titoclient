import React, {useEffect}from 'react'
import {useNavigate} from 'react-router-dom'
import './home.css'
import Post from './post.js'
import Navbar from './nav.js'
import Header from './header.js'
function Home(){ 
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/login')
        }
    });
    return(
        <div id="app">
            <Post/>
            <Header/>
            <Navbar/>
        </div>
    )
}
export default Home;