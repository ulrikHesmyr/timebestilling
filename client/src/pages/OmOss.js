import React from 'react'
import Footer from '../components/Footer'

function OmOss({env}){


  return (
    <div style={{position:"relative"}}>
    <div className='omOss'>
        <div className='omOssChild'>
            <h1 >Om oss</h1>
            <div>
                <p className='storbokstav'>
                    {env.omOssArtikkel}
                </p>
            <br></br>
            <br></br>
              <div className="omOssSiden">
              {env.omOssFeed.map((innhold, index) => {

                  return (
                  <div key={index} className='omOssDiv'>
                      {innhold.type === "i" && <img className='omOssBildene' src={`${window.origin}/uploads/${innhold.content}`} alt={innhold.alt}></img>}
                      {innhold.type === "p" && <p>{innhold.content}</p>}
                      {innhold.type === "h" && <h2>{innhold.content}</h2>}
                      
                  </div>)
              })}
              </div>
            </div>
            
        </div>
    </div>
        <Footer env={env}/>
    </div>
  )
}

export default React.memo(OmOss);