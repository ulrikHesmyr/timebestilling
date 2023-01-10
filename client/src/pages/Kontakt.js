import React from 'react'

function Kontakt({env}){
    return(
        <>
            <h3>Kontakt oss!</h3>
            <div className='sosialemedier'>
                {env.sosialeMedier.map((medie)=>(
                    <div key={medie.platform}>
                        <img src={`${medie.platform}.png`} style={{height:"5rem", aspectRatio:3/2, objectFit:"contain", mixBlendMode:"color-burn"}} alt={`${medie.platform}`}></img>
                        <p>{medie.bruker}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default React.memo(Kontakt);