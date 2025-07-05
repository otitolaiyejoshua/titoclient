import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Navbar from './nav.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function Search() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [likesData, setLikesData] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
    }, [navigate]);

    const fetchUserLikes = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`https://titoserver.onrender.com/api/tops/${userId}`);
            setUserLikes(response.data);
        } catch (error) {
            console.error('Error fetching personal likes:', error);
        }
    };

    const fetchLikes = async (tweetArray) => {
        const likePromises = tweetArray.map(async (post) => {
            try {
                const res = await axios.get(`https://titoserver.onrender.com/api/tweets/${post.id}/likes`);
                return { tweetId: post.id, likes: res.data.likecounts };
            } catch {
                return { tweetId: post.id, likes: 0 };
            }
        });
        const results = await Promise.all(likePromises);
        setLikesData(results);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://titoserver.onrender.com/api/users/${username}`);
            const { user, posts } = response.data;

            setSearchedUser(user);
            setPosts(posts);
            fetchLikes(posts);
            fetchUserLikes();

            // Check follow status
            const checkFollow = await axios.get(`https://titoserver.onrender.com/api/follow/status/${userId}/${user.userId}`);
            setIsFollowing(checkFollow.data.following);
        } catch (error) {
            console.error('Error searching user:', error);
        }
    };

    const handleLike = async (tweetId) => {
        try {
            await axios.post(`https://titoserver.onrender.com/api/tweets/${tweetId}/like`, { userId });
            fetchUserLikes();
            fetchLikes(posts);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const hasUserLiked = (tweetId) => {
        return userLikes.some((like) => like.tweet_id === tweetId);
    };

    const toggleFollow = async () => {
        try {
            await axios.post(`https://titoserver.onrender.com/api/users/${searchedUser.userId}/follow`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    return (
        <div>
            <div id="search">
                <span id="back" onClick={() => navigate('/')}><FontAwesomeIcon icon="arrow-left" /></span>
                <input
                    id="searchpeople"
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Search users #tags "
                />
                <span id="handleusers" onClick={handleSearch}>
                    <FontAwesomeIcon icon="search" />
                </span>
            </div>

            {searchedUser && (
                <div id="userinfo">
                    <div id="userpage">
                        <div id="portfolio">
                            {searchedUser.profile_picture && (
                                <img
                                    id="profile"
                                    src={`https://titoserver.onrender.com/uploads/${searchedUser.profile_picture}`}
                                    alt="Profile"
                                />
                            )}
                            <span id="name">{searchedUser.username}</span>
                            {searchedUser.bio && <span id="biodata">{searchedUser.bio}</span>}

                            <div id="details">
                                <span className="in">
                                    <span className="value">{searchedUser.total_posts}</span> Posts
                                </span>
                                <span className="in">
                                    <span className="value">{searchedUser.followers_count}</span> Followers
                                </span>
                                <span className="in">
                                    <span className="value">{searchedUser.total_likes}</span> Likes
                                </span>
                            </div>

                            {userId !== searchedUser.userId && (
                                <div id="follow-wrapper">
                                    <button onClick={toggleFollow} id="followBtn">
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div id="cards2">
                        {posts.map((post, index) => (
                            <div id="post" key={post.id}>
                                <div id="content">
                                    <div id="horizon">
                                        <div id="images">
                                            <img
                                                id="postimage"
                                                src={`https://titoserver.onrender.com/uploads/${post.profile_picture}`}
                                                alt="Profile"
                                            />
                                        </div>
                                        <div id="textes">
                                            <p id="title">{post.username}</p>
                                        </div>
                                    </div>
                                    {post.caption && <p id="top">{post.caption}</p>}
                                    {post.imageUrl && (
                                        <img
                                            id="postpic"
                                            src={`https://titoserver.onrender.com/uploads/${post.imageUrl}`}
                                            alt="Uploaded"
                                        />
                                    )}
                                    <div id="below">
                                        <div className="icons">
                                            <FontAwesomeIcon
                                                icon="heart"
                                                style={{ color: hasUserLiked(post.id) ? 'red' : 'black' }}
                                                onClick={() => handleLike(post.id)}
                                            />
                                            <span className="numbers">
                                                {likesData.find(l => l.tweetId === post.id)?.likes || 0}
                                            </span>
                                        </div>
                                        <div className="icons"><FontAwesomeIcon icon="comment" /><span className="numbers">0</span></div>
                                        <div className="icons"><FontAwesomeIcon icon="retweet" /><span className="numbers">0</span></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Navbar />
        </div>
    );
}

export default Search;
