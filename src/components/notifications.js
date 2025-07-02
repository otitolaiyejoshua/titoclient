import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Mark all notifications as read
    const markAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/api/notifications/mark-as-read", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(); // Refresh notifications after marking as read
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Auto-refresh notifications every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="notification-container" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <div className="notification-bell" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faBell} size="lg" />
                {notifications.some(n => !n.is_read) && (
                    <span className="notification-badge">
                        {notifications.filter(n => !n.is_read).length}
                    </span>
                )}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <strong>Notifications</strong>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">No new notifications</div>
                        ) : (
                            notifications.map(notification => (
                                <div key={notification.id} className={`notification-item ${notification.is_read ? "" : "unread"}`}>
                                    <FontAwesomeIcon 
                                        icon={notification.is_read ? faCheckCircle : faBell} 
                                        size="lg" 
                                        color={notification.is_read ? "green" : "blue"} 
                                    />
                                    <span>{notification.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <button className="mark-read-btn" onClick={markAsRead}>
                            Mark all as read
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
