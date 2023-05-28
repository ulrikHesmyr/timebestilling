import React from 'react'
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