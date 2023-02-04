import React from 'react'

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
                        <p>{medie.bruker}</p>
                    </div>
                ))}
            </div>
            <footer>
                <p>Copyright &copy; 2022 Timereservasjon - Ulrik Hesmyr</p>
                <p>Ikoner fra <a rel='noreferrer' target="_blank" href='https://fonts.google.com/icons'>google</a></p>
            </footer>
        </div>
    )
}

export default React.memo(Kontakt);