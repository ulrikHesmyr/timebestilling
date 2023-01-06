import React from "react";


function Hjem({env}){
    return(
        <div className="hjem">
            <h1>Vi er {env.bedrift}</h1>
        </div>
    )
}

export default React.memo(Hjem)