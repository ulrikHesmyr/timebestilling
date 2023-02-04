import React from "react";
import { Link } from "react-router-dom";


function Hjem({env}){
    return(
        <div className="hjem">
            <h1>Vi er {env.bedrift}</h1>
            
            <Link to="/timebestilling" className='navBarBestillTime'>Bestill time</Link>
        </div>
    )
}

export default React.memo(Hjem)