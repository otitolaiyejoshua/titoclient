import React, {useState,useEffect} from 'react'
import Forgotpass from './components/forgotpass.js'
import Login from './components/login'
import Notifications from './components/notifications.js'
import Register from './components/register'
import Home from './components/home'
import User from './components/user.js'
import {useNavigate} from 'react-router-dom'
import Settings from './components/settings.js'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import {library} from '@fortawesome/fontawesome-svg-core'
import Search from './components/search.js'
import TweetDetails from './components/TweetDetails.js'
import ProfilePic from './components/profilepic.js'
import {faUser,faPaperPlane,faHome,faShare,faHeart,faCamera,faEdit,faToggleOff,faTrash,faUserPlus,faQuestionCircle,faPowerOff,faUserCircle,faTimes,faPeopleGroup,faGear,faRetweet,faComment,faBell, faSearch,faSignOutAlt,faPlusCircle,faHouse, faEllipsisH, faArrowLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faUser,faPaperPlane,faEllipsisH,faUserPlus,faShare,faCamera,faHome,faHeart,faToggleOff,faQuestionCircle,faEdit,faTrash,faPowerOff,faUserCircle,faArrowLeft,faGear,faPeopleGroup,faTimes,faRetweet,faComment,faBell, faSearch,faSignOutAlt,faPlusCircle,faHouse );
function App(){

  return(
    <>
    <div className="App">
    <Router >
      <Routes>
        <Route exact path='/login'  element={<Login/>}></Route>
        <Route path="/search" element={<Search/>}></Route>
        <Route path='/register'element={<Register/>}/>
        <Route path="/profilePicture" element={<ProfilePic/>}></Route>
        <Route path='/'element={<Home/>}/>
        <Route path="/forgotpass" element={<Forgotpass/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/notifications' element={<Notifications/>}/>
        <Route path="/tweets/:tweetid" element={<TweetDetails />} />
      </Routes>
    </Router>
    </div>
    </>
  )
}
export default App;