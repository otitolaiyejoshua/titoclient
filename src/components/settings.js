import React, { useEffect, useState } from 'react';
import Navbar from './nav.js';
import './home.css';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faToggleOff,
  faQuestionCircle,
  faTrash,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import defaultProfilePic from './default-profile.png';

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
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const url = `https://titoserver.onrender.com/api/user/${userId}`;
        const response = await axios.get(url);

        const data = response.data;
        setName(data.username);
        setProfilePic(data.profile_picture || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div id="settings">
        <img
          id="profilepicture"
          src={profilePic ? `https://titoserver.onrender.com/uploads/${profilePic}` : defaultProfilePic}
          alt="Profile"
        />
        <span id="nametitle">{name}</span>

        {/* Change Profile Picture Option */}
        <div id="change-profile">
          <a id="changeprofilepic" href="/profilePicture">
            Change Profile Picture
          </a>
        </div>

        <div id="options">
          <span id="option">
            Edit account <FontAwesomeIcon icon={faEdit} />
          </span>
          <span id="option">
            Dark Mode <FontAwesomeIcon icon={faToggleOff} />
          </span>
          <span id="option">
            Help <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
          <span id="option">
            Delete account <FontAwesomeIcon icon={faTrash} />
          </span>
          <span id="option" onClick={handleLogout}>
            Log out <FontAwesomeIcon icon={faPowerOff} />
          </span>
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default Settings;
