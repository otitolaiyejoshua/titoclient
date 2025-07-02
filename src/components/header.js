import React from 'react'
import Tito from './tito.jpg'
import './home.css'
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function Header(){
    const navigate = useNavigate();
    function handleNotifications(){
        navigate('/notifications')
    }
    return(
        <>
            <div id="header">
                <FontAwesomeIcon id="friendly" icon="fa solid fa-user-plus"/>
                <img id="mid" src={Tito} alt="logo"/>
                <FontAwesomeIcon onClick={handleNotifications} id="friendly" icon="fa solid fa-bell"/>
            </div>
        </>
    )

}
export default Header