import React, {useState, useEffect} from 'react'
import Footer from '../components/Footer'

function OmOss({env}){

  const [omOssFeed, sOmOssFeed] = useState([...env.omOssFeed]);

  
  useEffect(()=>{
    async function hentBlob(){
        let tempOmOss = [...env.omOssFeed]
        for(let i = 0; i < tempOmOss.length; i++){
            if(tempOmOss[i].type === "i"){
                const imgBlob = await fetch("/uploads/" + tempOmOss[i].content);

                const imgBlobUrl = URL.createObjectURL(imgBlob);
                tempOmOss[i].src = imgBlobUrl;
            }
        }
        sOmOssFeed(tempOmOss);
        
    }
    hentBlob();

    
}, []);

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
              {omOssFeed.map((innhold, index) => {

                  return (
                  <div key={index} className='omOssDiv'>
                      {innhold.type === "i" && <img className='omOssBildene' src={innhold.src} alt={innhold.alt}></img>}
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