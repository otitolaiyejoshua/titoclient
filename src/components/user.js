import React, { useEffect, useState } from 'react';
import axios from 'axios';
import General from './genoption.js';
import './home.css';
import Navbar from './nav.js';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faRetweet, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import defaultProfilePic from './default-profile.png'; // Default profile image


function User() {
    const navigate = useNavigate();
    const [bio, setBio] = useState('');
    const [option, setOption] = useState(false);
    const [tops, setTops] = useState([]);
    const [name, setName] = useState('');
    const [postno, setPostNo] = useState(0);
    const [profilePic, setProfilePic] = useState('');
    const [Id, setTweetId] = useState('');
    const [userId, setUserId] = useState(null);
    const [likesData, setLikesData] = useState({});
    const [comments, setComments] = useState({}); // Store comment count
    const [commentCounts, setCommentCounts] = useState({});

    useEffect(() => {
        if (tops.length > 0) {
            fetchLikes();
            fetchCommentCounts();
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
    }, [navigate]);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const url = `http://localhost:5000/api/user/${userId}`;
                const response = await axios.get(url);

                if (response.data.length > 0) {
                    setTops(response.data);
                    setPostNo(response.data.length);
                    setName(response.data[0].username);
                    setBio(response.data[0].bio || '');
                    setProfilePic(response.data[0].profile_picture || '');
                    console.log(tops);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

   
    const fetchLikes = async () => {
        try {
            const likesPromises = tops.map(async (top) => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/tweets/${top.id}/likes`);
                    return { tweetId: top.id, likes: response.data.likecounts };
                } catch (error) {
                    console.error('Error fetching likes:', error);
                    return { tweetId: top.id, likes: 0 };
                }
            });

            const likesDataArray = await Promise.all(likesPromises);
            const likesDataObject = likesDataArray.reduce((acc, item) => {
                acc[item.tweetId] = item.likes;
                return acc;
            }, {});
            setLikesData(likesDataObject);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };
    const handleLove = async (tweetid) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/tweets/${tweetid}/like`, { userId });
            const updatedLiked = response.data.liked;
            setLikesData((prevLikes) => ({
                ...prevLikes,
                [tweetid]: updatedLiked ? (prevLikes[tweetid] || 0) + 1 : Math.max((prevLikes[tweetid] || 0) - 1, 0),
            }));
        } catch (error) {
            console.error('Error liking a post', error);
        }
    };
    const fetchCommentCounts = async () => {
        try {
            const commentPromises = tops.map(async (top) => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/tweets/${top.id}/comments/count`);
                    return { tweetId: top.id, comments: response.data.count };
                } catch (error) {
                    console.error('Error fetching comment count:', error);
                    return { tweetId: top.id, comments: 0 };
                }
            }); 

            const commentDataArray = await Promise.all(commentPromises);
            const commentDataObject = commentDataArray.reduce((acc, item) => {
                acc[item.tweetId] = item.comments;
                return acc;
            }, {});
            setCommentCounts(commentDataObject);
        } catch (error) {
            console.error('Error fetching comment counts:', error);
        }
    };

    const handleComment = (tweetid) => {
        navigate(`/tweets/${tweetid}`);
    };
    
    return (
        <div id="userinfo">
            <div id="userpage">
                <div id="portfolio">
                    <img 
                        id="profile" 
                        src={profilePic ? `http://localhost:5000/uploads/${profilePic}` : defaultProfilePic} 
                        alt="Profile"
                    />
                    <span id="name">{name}</span>
                    {bio && <span id="biodata">{bio}</span>}
                    <div id="details">
                        <span className="in"><span className="value">100</span> Friends</span>
                        <span className="in"><span className="value">{postno}</span> Posts</span>
                        <span className="in"><span className="value">20</span> Comments</span>
                    </div>
                </div>
            </div>

            <div id="cards">
                {tops.map((top) => (
                    <div id="post" key={top.id}>
                        <div id="content">
                            <div id="horizon">
                                <div id="images">
                                    <img 
                                        id="postimage" 
                                        src={top.profile_picture ? `http://localhost:5000/uploads/${top.profile_picture}` : defaultProfilePic} 
                                        alt="profilepic" 
                                    />
                                </div>
                                <div id="textes">
                                    <p id="title">{top.username}</p>
                                </div>
                                <FontAwesomeIcon 
                                    icon="ellipsis-h" 
                                    id="iconi" 
                                    onClick={() => { setOption(true); setTweetId(top.id); }} 
                                />
                                {top.id === Id && <General option={option} onCancel={() => setOption(false)} />}
                            </div>
                            {top.caption && <p id="top">{top.caption}</p>}
                            {top.imageUrl && <img id="postpic" src={'http://localhost:5000/uploads/' + top.imageUrl} alt="uploaded photo" />}
                            <div id="below">
                                <div className='icons'>
                                    <FontAwesomeIcon 
                                        icon='heart' 
                                        onClick={() => handleLove(top.id)}
                                        style={{ color: likesData[top.id] > 0 ? 'red' : 'black', cursor: 'pointer' }}
                                    />
                                    <span className="numbers">{likesData[top.id] || 0}</span>
                                </div>
                                <div className='icons'>
                                    <FontAwesomeIcon icon="comment" onClick={() => handleComment(top.id)} />
                                    <span className="numbers">{commentCounts[top.id] || 0}</span>
                                </div>
                                <div className='icons'>
                                    <FontAwesomeIcon icon="retweet" />
                                    <span className="numbers">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Navbar />
        </div>
    );
}

export default User;
