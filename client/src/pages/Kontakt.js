import React from 'react'

function Kontakt({env}){
    return(
        <div className='kontaktsiden'>
            <h3>Kontakt oss!</h3>
            <div>{env.kontakt_epost}</div>
            <div>{env.kontakt_tlf}</div>
            <div className='sosialemedier'>
                {env.sosialeMedier.map((medie)=>(
                    <div key={medie.platform}>
                        <img src={`${medie.platform}.png`} style={{height:"5rem", aspectRatio:3/2, objectFit:"contain", mixBlendMode:"color-burn"}} alt={`${medie.platform}`}></img>
                        <p>{medie.bruker}</p>
                    </div>
                ))}
            </div>
            <footer>Nettapplikasjon levert av: ulrik.hesmyr@gmail.com</footer>
        </div>
    )
}

export default React.memo(Kontakt);