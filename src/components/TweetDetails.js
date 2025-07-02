import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultProfilePic from './default-profile.png';
import Navbar from './nav.js'
function TweetDetails() {
    const { tweetid } = useParams(); 
    const [tweet, setTweet] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTweetAndComments();
    }, [tweetid]);

    const fetchTweetAndComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tweets/${tweetid}/details`);
            console.log("Fetched Data:", response.data); // Debugging

            setTweet(response.data.tweet);
            setComments([...response.data.comments]); // Ensure state updates properly
        } catch (error) {
            setError('Error fetching tweet details');
            console.error(error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
    
        const token = localStorage.getItem("token");
        console.log("Token being used:", token); // ✅ Debugging
    
        if (!token) {
            console.error("No token found in localStorage.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/tweets/${tweetid}/comments`,
                { commentText: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure correct format
                }
            );
    
            console.log("Comment posted:", response.data);
            setNewComment("");
            fetchTweetAndComments(); // Reload comments
        } catch (error) {
            console.error("Error posting comment:", error.response ? error.response.data : error);
        }
    };
    
    return (
        <div className="tweet-details-container">
            {tweet && (
                <div className="tweet-card">
                    <div className="tweet-header">
                        <img src={tweet.profile_picture ? `http://localhost:5000/uploads/${tweet.profile_picture}` : defaultProfilePic} alt="Profile" className="profile-pic" />
                        <span className="tweet-username">{tweet.username}</span>
                    </div>
                    <p className="tweet-text">{tweet.caption}</p>
                    {tweet.imageUrl && <img className="tweet-image" src={`http://localhost:5000/uploads/${tweet.imageUrl}`} alt="Tweet" />}
                </div>
            )}

            <div className="comment-section">
                <h3>Comments</h3>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." required />
                    <button type="submit">Post</button>
                </form>

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <img src={comment.profile_picture ? `http://localhost:5000/uploads/${comment.profile_picture}` : defaultProfilePic} alt="Profile" className="profile-pic" />
                            <div className="comment-text">
                                <span className="comment-username">{comment.username}</span>
                                <p>{comment.comment_text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
            </div>
            <Navbar />
        </div>
    );
}

export default TweetDetails;
