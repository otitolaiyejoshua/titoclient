import React from 'react'
import axios from 'axios'
function Delete(prop){
    if(!prop.option){
        return null;
    }
    return(
        <>
            <div id="more">
                <div id="item">
                <ol onClick={prop.onDelete}>Delete</ol>
                <ol>Share</ol>
                <ol onClick={prop.onCancel}>Cancel</ol>
            </div>
             </div>
        </>
    )
}
export default Delete;