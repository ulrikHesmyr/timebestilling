import React from "react";
import { Link } from "react-router-dom";


/*
 <video autoplay muted loop id="myVideo">
                <source src="startside.mp4" type="video/mp4"></source>
                Your browser does not support HTML5 video.
                </video>
 */
function Hjem({env}){
    return(<>
        <div className="hjem">
            <header>
                <h1>Vi er {env.bedrift}</h1>
                
            </header>
            <Link to="/timebestilling" className='navBarBestillTime'><div>Bestill time</div></Link>

        </div>
        <div className="startside">
            <div>
            <h2>Åpningstider</h2>
            Åpningstider
            </div>
            <div>
            <h2>Om oss</h2>
            Frisører
            </div>
        </div>
        <div className="startside">
            <div>
            <h2>Hvor du finner oss</h2>
            <p>{env.adresse}</p>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113630.82896655216!2d-109.40885519659055!3d-27.125962577807506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9947f017a8d4ae2b%3A0xbbe5b3edc02a2db6!2sEaster%20Island!5e0!3m2!1sen!2sno!4v1676406864760!5m2!1sen!2sno" title="Kart"  style={{border:"none", width:"300", height:"225"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div>
            <h2>Det siste fra vår instagram!</h2>
            
            </div>
        </div>
        </>
    )
}

export default React.memo(Hjem)