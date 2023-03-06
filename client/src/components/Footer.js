import React from 'react'
import {Link} from 'react-router-dom'

function Footer(){
  return (
    <footer>
    <p>Ikoner fra <a rel='noreferrer' target="_blank" href='https://fonts.google.com/icons'>google</a></p>
    <Link to="/personvaernserklaering-og-brukervilkaar">personvernserklæring og brukervilkår</Link>
    <Link to="/kontakt-oss">Kontakt oss</Link>
    <Link to="/om-oss">Om oss</Link>
    <p>SMS bekreftelse: <a rel='noreferrer' target="_blank" href='https://strex.no/'>Strex</a></p>
    <p>Universell utforming: uutilsynet.no</p>
    <p>Copyright &copy; 2022 Timereservasjon - Ulrik Hesmyr</p>

</footer>
  )
}

export default React.memo(Footer);