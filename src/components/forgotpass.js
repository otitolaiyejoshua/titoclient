import React from 'react'
import './style.css'
import Tito from './titos.jpg'
function Forgotpass(){
    return(
        <>
            <div id="container">
                <div id="left">
                <h1>Reset PassWord</h1>
                </div>
            <div id="right">
            <form>
            <input type="password" className="name" placeholder="Enter Old Password"/>
            <input type="password" className="name" placeholder="New Password"/>
            <input type="submit" id="btn" value="Submit"/>
            </form>
            </div>
            </div>
        </>
    )
}
export default Forgotpass;