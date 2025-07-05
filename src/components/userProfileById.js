import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Navbar from './nav.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserProfileById() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [likesData, setLikesData] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
        fetchProfileData(decoded.userId);
    }, [username]);

    const fetchProfileData = async (loggedInUserId) => {
        try {
            const response = await axios.get(`https://titoserver.onrender.com/api/users/${username}`);
            const { user, posts } = response.data;

            setUser(user);
            setPosts(posts);
            fetchLikes(posts);
            fetchUserLikes(loggedInUserId);

            const followStatusRes = await axios.get(`https://titoserver.onrender.com/api/follow/status/${loggedInUserId}/${user.userId}`);
            setIsFollowing(followStatusRes.data.following);
        } catch (error) {
            console.error('Error loading profile:', error);
            // navigate('/'); // Optionally redirect if user doesn't exist
        }
    };

    const fetchUserLikes = async (uid) => {
        try {
            const response = await axios.get(`https://titoserver.onrender.com/api/tops/${uid}`);
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

    const handleLike = async (tweetId) => {
        try {
            await axios.post(`https://titoserver.onrender.com/api/tweets/${tweetId}/like`, { userId });
            fetchUserLikes(userId);
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
            await axios.post(`https://titoserver.onrender.com/api/users/${user.userId}/follow`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <div id="userinfo">
                <div id="userpage">
                    <div id="portfolio">
                        <img
                            id="profile"
                            src={user.profile_picture ? `https://titoserver.onrender.com/uploads/${user.profile_picture}` : '/default-profile.png'}
                            alt="Profile"
                        />
                        <span id="name">{user.username}</span>
                        {user.bio && <span id="biodata">{user.bio}</span>}

                        <div id="details">
                            <span className="in">
                                <span className="value">{user.total_posts}</span> Posts
                            </span>
                            <span className="in">
                                <span className="value">{user.followers_count}</span> Followers
                            </span>
                            <span className="in">
                                <span className="value">{user.total_likes}</span> Likes
                            </span>
                        </div>

                        {userId !== user.userId && (
                            <div id="follow-wrapper">
                                <button onClick={toggleFollow} id="followBtn">
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div id="cards2">
                    {posts.map((post) => (
                        <div id="post" key={post.id}>
                            <div id="content">
                                <div id="horizon">
                                    <div id="images">
                                        <img
                                            id="postimage"
                                            src={`https://titoserver.onrender.com/uploads/${post.profile_picture}`}
                                            alt="Profile"
                                            onClick={() => navigate(`/user/${post.username}`)}
                                        />
                                    </div>
                                    <div id="textes">
                                        <p id="title" onClick={() => navigate(`/user/${post.username}`)}>{post.username}</p>
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

            <Navbar />
        </div>
    );
}

export default UserProfileById;
