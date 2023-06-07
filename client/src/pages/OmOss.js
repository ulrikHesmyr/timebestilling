import React, {useState} from 'react'
import Footer from '../components/Footer'

function OmOss({env}){

  const [omOssFeed, sOmOssFeed] = useState([...env.omOssFeed]);

  return (
    <div style={{position:"relative"}}>
    <div className='omOss'>
        <div className='omOssChild'>
            <h1 >Om oss</h1>
            <div>{env.omOssArtikkel}
            <br></br>
            <br></br>
              <div className='omOssFeed'>
                display greier her
              </div>
            </div>
            
        </div>
    </div>
        <Footer env={env}/>
    </div>
  )
}

export default React.memo(OmOss);