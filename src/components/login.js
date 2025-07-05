import React,{useState} from 'react'
import Tito from './titos.jpg'
import axios from 'axios'
import './style.css'
import {useNavigate} from 'react-router-dom'
const Login =()=>{
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [message,setMessage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('https://titoserver.onrender.com/api/login', { username, password });
          setMessage(response.data.message);
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            navigate('/profilePicture')
          }
    
          setUsername('');
          setPassword('');
        } catch (error) {
          console.error('Error logging in:', error);
          setMessage('Error logging in');
        }
    };
    return(
        <>
            <div id="container">
                <div id="left">
                    <img id="logo" src={Tito}/>
                </div>
                <div id="right">
                     <div id="message">{message}</div>
                <form onSubmit={handleSubmit}>
                <h1>Hello again!!</h1>
                <input className="name"value={username} type="text" placeholder="Username" onChange ={(e)=>{ setUsername(e.target.value)}} required/>
                <input id="pass" value={password} type="password" placeholder="....." onChange ={(e)=>{ setPassword(e.target.value)}} required/>
                <a id="forgotpass" href="/forgotpassword">Forgot Password?</a>
                <input id="btn" value="Log in"type="submit"/>
                <div id="info"><p>Don't have an account?</p><a href="/register" id="sign">Signup</a></div>
                </form>
                </div>
            </div>
        </>
      )
}
export default Login;