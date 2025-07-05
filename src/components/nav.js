import React, { useState, useEffect, useRef } from 'react';
import TweetForm from './TweetForm.js';
import { useNavigate } from 'react-router-dom';
import './home.css';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckCircle, faHome, faSearch, faPlusCircle, faPaperPlane, faCog } from '@fortawesome/free-solid-svg-icons';
import defaultProfilePic from './default-profile.png';

function Navbar() {
    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const notificationRef = useRef(null);

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
                const response = await axios.get(`https://titoserver.onrender.com/api/user/${userId}`);
                setProfilePic(response.data?.profile_picture || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://titoserver.onrender.com/api/notifications/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications, userId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const unreadNotifications = notifications.filter(n => !n.is_read);
    
            // Send requests to mark each unread notification as read
            await Promise.all(
                unreadNotifications.map(notification => 
                    axios.post(`https://titoserver.onrender.com/api/notifications/${notification.id}/read`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );
    
            // Update the UI to reflect read notifications
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };
    

    return (
        <>
            <TweetForm show={show} onClose={() => setShow(false)} />
            <nav className="bottom-navbar">
                <span className="navicons" onClick={() => navigate('/')}> <FontAwesomeIcon icon={faHome} /> </span>
                <span className="navicons" onClick={() => navigate('/search')}> <FontAwesomeIcon icon={faSearch} /> </span>
                <span className="navicons" id="plus" onClick={() => setShow(true)}> <FontAwesomeIcon icon={faPlusCircle} /> </span>
                <span className="navicons" onClick={() => navigate('/messages')}> <FontAwesomeIcon icon={faPaperPlane} /> </span>
                <span className="navicons" onClick={() => navigate('/settings')}> <FontAwesomeIcon icon={faCog} /> </span>
                
                <span className="navicons" id="navnotification" onClick={() => setShowNotifications(!showNotifications)}>
                {notifications.filter(n => !n.is_read).length > 0 && (
                        <span className="notification-badge">{notifications.filter(n => !n.is_read).length}</span>
                    )}
                    <FontAwesomeIcon icon={faBell} />
                    
                </span>

                {showNotifications && (
                    <div className="notification-dropdown" ref={notificationRef}>
                        <strong>Notifications</strong>
                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <div>No new notifications</div>
                            ) : (
                                notifications.map(notification => (
                                    <div key={notification.id} className={`notification-item ${notification.is_read ? '' : 'unread'}`}>
                                        <FontAwesomeIcon icon={notification.is_read ? faCheckCircle : faBell} color={notification.is_read ? 'green' : 'blue'} />
                                        <span>{notification.message}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button className="mark-read-btn" onClick={markAsRead}> Mark all as read </button>
                        )}
                    </div>
                )}
                
                <img
                    id="pic"
                    src={profilePic ? `https://titoserver.onrender.com/uploads/${profilePic}` : defaultProfilePic}
                    className="navicons"
                    onClick={() => navigate('/user')}
                    alt="Profile"
                />
            </nav>
        </>
    );
}

export default Navbar;
