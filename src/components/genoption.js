import React from 'react'
import axios from 'axios'
function General(prop){
    if(!prop.option){
        return null;
    }
    return(
        <>
            <div id="more">
                <div id="item">
                <ol>Share</ol>
                <ol onClick={prop.onCancel}>Cancel</ol>
            </div>
             </div>
        </>
    )
}
export default General;