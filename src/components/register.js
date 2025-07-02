import React, {useState}from 'react'
import Tito from './titos.jpg'
import './style.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
function Register(){
    const navigate = useNavigate();
    const [username,setUsername]= useState("");
    const [password,setPassword]= useState("");
    const [email,setEmail]= useState("");
    const [message,setMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('http://localhost:5000/api/register', { username, email,password });
          setMessage(response.data.message);
          setUsername('');
          setPassword('');
          setEmail('');
          navigate('/login')
        } catch (error) {
          console.error('Error registering user:', error);
          setMessage('Error registering user');
          
        }
      };
    
    return(
        <>
            <div id="container">
            <div id="left">
                <img id="logo" src={Tito}/>
            </div>
            <div id="right">
                <div id="gmessage">{message}</div>
                <form onSubmit={handleSubmit}>
                    <h1>Welcome!!</h1>
                <input className="name" value={username}type="text" placeholder="Username" onChange = {(e)=>{
            setUsername(e.target.value)}} required/>
                <input className="name" value={email}type="text"  placeholder="Email"onChange = {(e)=>{
            setEmail(e.target.value)}} required/>
                <input id="pass" value={password}type="password" placeholder="....." onChange = {(e)=>{
            setPassword(e.target.value)}}required/>
                <button id="btn" type="submit">Sign Up</button>
                <div id="info"><p>Already have an account?</p> <a href="/login" id="sign">Login</a></div>
                </form>
            </div>
            </div>
        </>
    )
}
export default Register;