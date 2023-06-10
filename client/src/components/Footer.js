import React from 'react'
import {Link} from 'react-router-dom'

function Footer({env}){
  return (
    <footer>
    <Link to="/personvaernserklaering-og-brukervilkaar">Bruk av cookies, personvernserklæring og brukervilkår</Link>
    <Link to="/kontakt-oss">Kontakt oss</Link>
    <Link to="/om-oss">Om oss</Link>
    <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
    {env.sosialeMedier.map((medie)=>(
      <a key={medie.platform}  style={{display:"flex", flexDirection:"row", alignItems:"center"}}
       rel='noreferrer' target="_blank" href={medie.link}>
          <img loading='eager' src={`${medie.platform}.png`} style={{height:"2rem", objectFit:"contain"}} alt={`${medie.platform}`}></img>
      </a>
    ))}
    </div>
    <p className='c'>Copyright &copy; 2022 Timereservasjon - Hesmyr Web Technologies</p>

</footer>
  )
}

export default React.memo(Footer);