import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const TweetForm = (props)=> {
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const [message,setMessage] = useState('');
    const [userId,setUserId] = useState(null)
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
    const handleCaptionChange = (e)=>{
        setCaption(e.target.value);
    }
    const handleImageChange = function(e){
      const selectedImage = e.target.files[0]
      setImage(selectedImage);
      console.log(image)
    }
    if (!props.show){
      return null
  }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        if (!caption){
          formData.append('image', image);
          formData.append('userId',userId)
        }
        if(caption&&image){
          formData.append('image', image);
          formData.append('caption',caption)
          formData.append('userId',userId)
        }
        if(!image){
          formData.append('caption', caption)
          formData.append('userId',userId)
        }
        try{
            const request = await axios.post('https://titoserver.onrender.com/api/tweets',formData,{
              headers:{'Content-Type': 'multipart/form-data'},
            });
            setCaption('')
            setImage(null)
            setMessage(request.data.message)
        }catch(error){
            console.error('Error posting tweet:',error);
        }
    }
  return (
    <div className="modal">
  <form onSubmit={handleSubmit}>
        <div className="modal-content">
        <button className="button" onClick={props.onClose}><FontAwesomeIcon icon="times"/></button>
        <span id="tweetpost">{message}</span>
        <div id="tweeting">
        <textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="What's on your mind?"
        />
        <div id="shape">
        <input type="file" name="image" accept="image/*" id="img"onChange={handleImageChange} multiple={false}/>
        <label id="camera" htmlFor="img"><FontAwesomeIcon icon="camera"/></label>
        <input id="render" type="submit" value="Share"/>
        </div>
        </div>
        </div>
      </form>

        
        
    </div>

    
  );
};

export default TweetForm;
