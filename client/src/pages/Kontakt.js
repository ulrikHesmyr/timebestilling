import React from 'react'
import Footer from '../components/Footer'
import {Link} from 'react-router-dom'

function Kontakt({env}){

    return(
        <div className='kontaktbakgrunn'>
            
            <div className='kontaktsiden'>
                <h3>Kontakt oss!</h3>
                
                <div style={{cursor:"pointer"}} onClick={()=>{
                    navigator.clipboard.writeText(env.kontakt_epost);
                    alert("Kopiert epost til utklippstavle!");
                }}>{env.kontakt_epost}</div>
                <a href={`tel:+47${env.kontakt_tlf}`}>+47 {env.kontakt_tlf.toString().replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3')}</a>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <h4>Ønsker du å bestille time?</h4>
                    <p>Bestill time her: <Link to="/timebestilling">bestill time</Link> </p>
                </div>
                <div className='sosialemedier'>
                    {env.sosialeMedier.map((medie)=>(
                        <a key={medie.platform}  style={{display:"flex", flexDirection:"row", alignItems:"center"}}
                         rel='noreferrer' target="_blank" href={medie.link}>
                            <img loading='eager' src={`${medie.platform}.png`} style={{height:"5rem", objectFit:"contain"}} alt={`${medie.platform}`}></img>
                            {medie.bruker}
                        </a>
                    ))}
                    
                </div>
                
            </div>
            <Footer env={env}/>
        </div>
    )
}

export default React.memo(Kontakt);