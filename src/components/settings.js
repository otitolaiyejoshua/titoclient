import React, { useEffect, useState } from 'react';
import Navbar from './nav.js';
import './home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jwtDecode from 'jwt-decode';
import defaultProfilePic from './default-profile.png'; // Add a default profile image

function Settings() {
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
    }, [navigate]); // Runs only once when the component mounts

    useEffect(() => {
        if (!userId) return; // Wait for userId to be set

        const fetchUserData = async () => {
            try {
                const url = `http://localhost:5000/api/user/${userId}`;
                const response = await axios.get(url);
                if (response.data.length > 0) {
                    setName(response.data[0].username);
                    setProfilePic(response.data[0].profile_picture || '');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]); // Runs only when `userId` is set

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <div id="settings">
                <img 
                    id="profilepicture" 
                    src={profilePic ? `http://localhost:5000/uploads/${profilePic}` : defaultProfilePic} 
                    alt="Profile"
                />
                <span id="nametitle">{name}</span>

                {/* Change Profile Picture Option */}
                <div id="change-profile">
                    <a id="changeprofilepic" href="/profilePicture">Change Profile Picture</a>
                </div>

                <div id="options">
                    <span id="option">Edit account <FontAwesomeIcon icon="edit" /></span>
                    <span id="option">Dark Mode <FontAwesomeIcon icon="toggle-off" /> </span>
                    <span id="option">Help <FontAwesomeIcon icon="question-circle" /></span>
                    <span id="option">Delete account <FontAwesomeIcon icon="trash" /></span>
                    <span id="option" onClick={handleLogout}>Log out <FontAwesomeIcon icon="power-off" /></span>
                </div>
            </div>
            <Navbar />
        </>
    );
}

export default Settings;
