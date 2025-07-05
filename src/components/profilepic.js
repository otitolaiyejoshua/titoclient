import React,{useState,useEffect} from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'
function ProfilePic(){
    const navigate = useNavigate();
    const [Bio,setBio] = useState('');
    const [image, setImage] = useState({ preview: '', data: '' })
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(!token){
          console.error('User not authenticated')
          return;
      }
      if(token){
        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        setUserId(decodedToken.userId);
      }
      })
      function handleBio(e){
        const bio= e.target.value;
        setBio(bio)
      }
    function handleFile(e){
       const img ={
            preview:URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
       }
       setImage(img)
       console.log(image)
    }
    const handleProfile = async(e)=>{
        e.preventDefault();
        const formData =new FormData();
        formData.append('images',image.data);
        formData.append('userId',userId);
        formData.append('bio',Bio);
        try{
        const request = await axios.post('https://titoserver.onrender.com/api/profilepic',formData,{
              headers:{'Content-Type': 'multipart/form-data'},
            });
            console.log(request)
            setUserId('')
            setImage(null)
            navigate('/')
        }catch(error){
            console.error('Error posting tweet:',error);
        }
    }
    return(
        <div id="centered">
            <form onSubmit={handleProfile}>
            <h2>Set Profile Picture</h2>
            <input id="prof" type="file" onChange={handleFile} />
                <label id="cam" htmlFor="prof"><>{!image.preview && <FontAwesomeIcon icon="user"/>}</><>{image.preview && <img src={image.preview} style={{borderRadius:'100%',width:'100%',height:'100%'}}/>}</></label>
                <input id="bio" onChange={handleBio} placeholder="Write something about yourself"/>
            <input id="btn" type="submit" value="Upload" />
            <a href="/" id="sign">Skip</a>
            </form>
        </div>
    )
}
export default ProfilePic;