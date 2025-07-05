// FriendsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import './FriendsList.css';

const FriendsList = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.warn("No token found");
      return;
    }

    setToken(storedToken);
    const decoded = jwtDecode(storedToken);
    setCurrentUserId(decoded.userId);

    // Fetch all users
    axios.get('https://titoserver.onrender.com/api/users', {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error('❌ Failed to fetch users', err));
  }, []);

  const toggleFollow = async (userId) => {
    try {
      const res = await axios.post(`https://titoserver.onrender.com/api/users/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(prev => ({
        ...prev,
        [userId]: res.data.following
      }));
    } catch (error) {
      console.error('❌ Follow/Unfollow error:', error);
    }
  };

  return (
    <div className="friends-container">
      <h2>Find Friends</h2>
      {users.length === 0 && <p>No users found.</p>}
      {users.filter(u => u.id !== currentUserId).map(user => (
        <div className="friend-card" key={user.id}>
          <img
            src={`https://titoserver.onrender.com/uploads/${user.profile_picture}`}
            alt={user.username}
            className="friend-image"
          />
          <div className="friend-details">
            <h4>@{user.username}</h4>
            <button
              className={following[user.id] ? 'unfollow-btn' : 'follow-btn'}
              onClick={() => toggleFollow(user.id)}
            >
              {following[user.id] ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
