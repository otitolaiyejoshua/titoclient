import React,{useState,useEffect} from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import Navbar from './nav.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useNavigate} from 'react-router-dom'
function Search(){
    const navigate = useNavigate();
    const [option,setOption] = useState(false);
    const [tops,setTops] = useState([]);
    const [userId,setUserId] = useState(null)
    const [name,setName] = useState('');
    const [postno,setPostNo] = useState('');
    const [profilePic,setProfilePic] = useState('')
    const [username,setUsername] = useState('');
    const [value,setValue] = useState('');
    const [bio,setBio] = useState('');
    const [likesData,SetLikesData] = useState([]);
    const [colorArray,setColorArray] = useState([]);
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/login')
        }
        if (token){
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
            console.log(userId)
        }
    });
    const fetchPersonalLikes = async ()=>{
        try{
            const url = 'http://localhost:5000/api/tops/'+userId;
            const personal = await axios.get(url,{
            });
            setColorArray(personal.data)
            console.log(colorArray)
        }catch{
            console.log("null")
        }
}
const hasUserLikedTweet = async(tweetId)=>{
    return colorArray.some((color)=> color.tweet_id === tweetId)
}
    const fetchLikes = async ()=>{
        const likesPromises = tops.map(async(top)=>{
            try{
                const response = await axios.get('http://localhost:5000/api/tweets/'+top.id+'/likes');
                console.log(response)
                return{tweetId: top.id, likes: response.data.likecounts}
            }catch(error){
                console.error('Error fetching likes:',error);
                return {tweetId: top.id,likes:0}
            }
        })
        const likesData = await Promise.all(likesPromises);
        SetLikesData(likesData);
        console.log(likesData)
        fetchPersonalLikes();
    }
    const handleUsers =  async()=>{
        try{
            const response = await axios.get('http://localhost:5000/api/users/'+username,{});
            console.log(response);
            setTops(response.data)
            console.log(tops.id)
            setBio(response.data[0].bio)
            setProfilePic(response.data[0].profile_picture)
            setName(response.data[0].username);
            setPostNo(response.data.length)
            console.log(postno)
        }catch(error){
            console.error('Error finding user');
        }   
    }
    const handleLove =async (tweetid)=>{
        try{
            const liking = axios.post('http://localhost:5000/api/tweets/'+tweetid+'/like',{userId},{
            });
            console.log(liking[0])
        }catch(error){
            console.error('Error liking a post',error)
        }
        fetchLikes();
    }
    
    const handleBack = function(){
        navigate('/')
    }
   return(
    <div>
        <div id="search">
            <span id="back" onClick={handleBack}><FontAwesomeIcon icon="arrow-left"/></span>
            <input id="searchpeople" onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Search users #tags "/>
            <span id="handleusers" onClick={handleUsers}><FontAwesomeIcon icon="search"/></span>
        </div>
        <div id="userinfo">
        <div id="userpage">
            <div id="portfolio">
                {profilePic && <img id="profile" src={'http://localhost:5000/uploads/'+profilePic}  alt="profilepic"/>}
                <span id="name">{name}</span>
                {bio && <span id="biodata">{bio}</span>}
                {profilePic && <div id="details"><span className="in"><span className="value">100</span>Friends</span><span className='in'><span className='value'>{postno}</span>Posts</span><span className='in'><span className='value'>20</span>Comments</span></div>}
            </div>
        </div>
        <div id="cards2">
            {tops.map((top,index)=>(
                <div id="post" key={top.id}>
                    <div id="content">
                        <div id="horizon">
                            <div id="images">
                                <img id="postimage" src={'http://localhost:5000/uploads/'+top.profile_picture}/>
                            </div>
                            <div id="textes">
                            <p id="title">{top.username}</p>
                        </div>
                    </div>
                    {top.caption && <p id="top">{top.caption}</p>}
                    {top.imageUrl && <img id="postpic" src={'http://localhost:5000/uploads/'+top.imageUrl} alt="uploaded photo"/>}
                    <div id="below">
                        <div className='icons'><FontAwesomeIcon style={{color: hasUserLikedTweet(top.id) ? 'red' :'black',}}icon='heart'onClick={()=> handleLove(top.id)}/><span className="numbers">{likesData[index] ? likesData[index].likes : 0}</span></div>
                        <div className='icons'><FontAwesomeIcon icon="comment"/><span className="numbers">0</span></div>
                        <div className='icons'><FontAwesomeIcon icon="retweet"/><span className="numbers">0</span></div>
                    </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
        <Navbar/>
        </div>
   )
    
}
export default Search;