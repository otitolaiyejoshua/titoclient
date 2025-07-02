import React, { useState, useEffect } from 'react';
import axios from 'axios';
import General from './genoption.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import defaultProfilePic from './default-profile.png';

function Post() {
    const [option, setOption] = useState(false);
    const [tops, setTops] = useState([]);
    const [Id, setTweetId] = useState('');
    const [errors, setError] = useState('');
    const [reverseTops, setReverseTops] = useState([]);
    const [likesData, setLikesData] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
        fetchTweets();
    }, []);

    useEffect(() => {
        if (reverseTops.length > 0) {
            fetchLikes();
            fetchCommentCounts();
        }
    }, [reverseTops]);

    const fetchTweets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tweets');
            const reversedData = [...response.data].reverse();
            setTops(reversedData);
            setReverseTops(reversedData);
        } catch (error) {
            setError("Check your internet connection!!");
            console.error('Error fetching tweets:', error);
        }
    };

    const fetchLikes = async () => {
        try {
            const likesPromises = reverseTops.map(async (top) => {
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

    const fetchCommentCounts = async () => {
        try {
            const commentPromises = reverseTops.map(async (top) => {
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

    const handleComment = (tweetid) => {
        navigate(`/tweets/${tweetid}`);
    };
    
    return (
        <>
            <div id="card">
                {reverseTops.map((top) => (
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
        </>
    );
}

export default Post;
