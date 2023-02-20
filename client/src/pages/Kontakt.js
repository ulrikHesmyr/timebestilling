import React from 'react'
import Footer from '../components/Footer'

function Kontakt({env}){
    return(
        <div className='kontaktsiden'>
            <h3>Kontakt oss!</h3>
            <div style={{cursor:"pointer"}} onClick={()=>{
                navigator.clipboard.writeText(env.kontakt_epost);
                alert("Kopiert epost til utklippstavle!");
            }}>{env.kontakt_epost}</div>
            <div>{env.kontakt_tlf}</div>
            <div className='sosialemedier'>
                {env.sosialeMedier.map((medie)=>(
                    <div key={medie.platform}>
                        <img src={`${medie.platform}.png`} style={{height:"5rem", aspectRatio:3/2, objectFit:"contain", mixBlendMode:"color-burn"}} alt={`${medie.platform}`}></img>
                        <a rel='noreferrer' target="_blank" href={medie.link}>{medie.bruker}</a>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    )
}

export default React.memo(Kontakt);