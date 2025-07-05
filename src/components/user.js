import React, { useEffect, useState } from 'react';
import axios from 'axios';
import General from './genoption.js';
import './home.css';
import Navbar from './nav.js';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import defaultProfilePic from './default-profile.png';

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
    const [followers, setFollowers] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0); // ✅ total likes

    useEffect(() => {
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
                const url = `https://titoserver.onrender.com/api/user/${userId}`;
                const response = await axios.get(url);

                const data = response.data;
                setTops(data.posts || []);
                setPostNo((data.posts || []).length);
                setName(data.username);
                setBio(data.bio || '');
                setProfilePic(data.profile_picture || '');
                setFollowers(data.followers || 0);
                setTotalLikes(data.totalLikes || 0); // ✅ set total likes
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        if (tops.length > 0) {
            fetchLikes();
        }
    }, [tops]);

    const fetchLikes = async () => {
        try {
            const likesPromises = tops.map(async (top) => {
                try {
                    const response = await axios.get(`https://titoserver.onrender.com/api/tweets/${top.id}/likes`);
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
            const response = await axios.post(`https://titoserver.onrender.com/api/tweets/${tweetid}/like`, { userId });
            const updatedLiked = response.data.liked;
            setLikesData((prevLikes) => ({
                ...prevLikes,
                [tweetid]: updatedLiked
                    ? (prevLikes[tweetid] || 0) + 1
                    : Math.max((prevLikes[tweetid] || 0) - 1, 0),
            }));
        } catch (error) {
            console.error('Error liking a post', error);
        }
    };

    return (
        <div id="userinfo">
            <div id="userpage">
                <div id="portfolio">
                    <img
                        id="profile"
                        src={profilePic ? `https://titoserver.onrender.com/uploads/${profilePic}` : defaultProfilePic}
                        alt="Profile"
                    />
                    <span id="name">{name}</span>
                    {bio && <span id="biodata">{bio}</span>}
                    <div id="details">
                        <span className="in"><span className="value">{followers}</span> Followers</span>
                        <span className="in"><span className="value">{postno}</span> Posts</span>
                        <span className="in"><span className="value">{totalLikes}</span> Likes</span> {/* ✅ replaced "Comments" */}
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
                                        src={profilePic ? `https://titoserver.onrender.com/uploads/${profilePic}` : defaultProfilePic}
                                        alt="profilepic"
                                    />
                                </div>
                                <div id="textes">
                                    <p id="title">{top.username || name}</p>
                                </div>
                                <FontAwesomeIcon
                                    icon={faEllipsisH}
                                    id="iconi"
                                    onClick={() => { setOption(true); setTweetId(top.id); }}
                                />
                                {top.id === Id && <General option={option} onCancel={() => setOption(false)} />}
                            </div>
                            {top.caption && <p id="top">{top.caption}</p>}
                            {top.imageUrl && (
                                <img id="postpic" src={'https://titoserver.onrender.com/uploads/' + top.imageUrl} alt="uploaded" />
                            )}
                            <div id="below">
                                <div className='icons'>
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        onClick={() => handleLove(top.id)}
                                        style={{
                                            color: likesData[top.id] > 0 ? 'red' : 'black',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <span className="numbers">{likesData[top.id] || 0}</span>
                                </div>
                                {/* Optional: Remove comment and retweet icons if not needed */}
                                <div className='icons'>
                                    <FontAwesomeIcon icon={faRetweet} />
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
