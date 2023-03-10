import React from 'react'
import {Link} from 'react-router-dom'
import Footer from '../components/Footer'
function OmOss({env}){
  return (
    <div style={{position:"relative"}}>
    <div className='omOss'>
        <div className='omOssChild'>
            <h1 >Om oss</h1>
            <div>{env.omOssArtikkel}
            <br></br>
            <br></br>
            <div><Link to="/"> Åpningstider, hvor du finner oss, våre ansatte og info om behandlinger</Link></div>
            <div><Link to="/kontakt-oss">Kontakt oss!</Link></div>
            <div className='bilder'>
              <img  alt='Bilde fra studio' src="bilde1.jpg"></img>
              <img  alt='Bilde fra studio' src="bilde2.jpg"></img>
              <img  alt='Bilde fra studio' src="bilde3.jpg"></img>
              <img  alt='Bilde fra studio' src="bilde4.jpg"></img>
              <img  alt='Bilde fra studio' src="bilde1.jpg"></img>
            </div>
            </div>
            
        </div>
    </div>
        <Footer/>
    </div>
  )
}

export default React.memo(OmOss)