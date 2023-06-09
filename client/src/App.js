import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import Timebestilling from './pages/Timebestilling'
import Hjem from './pages/hjem'
import DinReservasjon from './pages/DinReservasjon'
import Login from './pages/Login'
import './App.css'
import Kontakt from './pages/Kontakt'
import PB from './pages/Personvern_Brukervilkaar'
import OmOss from './pages/OmOss'


const App = ()=> {
  
  const [synligMeny, setSynligmeny] = useState(false);
  const [env, sEnv] = useState(null);
  const [registrertReservasjon, setReservasjon] = useState(undefined);

  useEffect(()=>{

    const fetchEnvironment = async ()=>{
      const data = await (
        await fetch("/env/env")
      ).json();
      if(data){
        sEnv(data);
      }
    }
    
    fetchEnvironment();

  }, [])


  return (
    <>{env !== null && <>  
      <Helmet>
          <meta
            http-equiv="Content-Security-Policy"
            content="img-src 'self' blob:;"
          />
        </Helmet>
          <BrowserRouter><div className='navHeader'>
          
          <button tabIndex={0} id="burgerButton" className='burger' aria-label='Vis navigasjonsmeny' aria-expanded={synligMeny} aria-controls="navigation" onClick={()=>{
                setSynligmeny(!synligMeny);
              }} style={{background:"transparent", border: "none"}}>
                <div></div>
                <div></div>
                <div></div>
              </button>
              <img style={{height:"3rem", aspectRatio:"1/1", objectFit:"contain"}} src="logo.png"></img>
        </div>
              {(synligMeny?(
              <nav id="navigation" className='navBar' role="region" aria-labelledby='burgerButton' aria-hidden={!synligMeny}>
                <Link onClick={()=>{
                  setSynligmeny(false);
                }} to="/">VI ER {(env !== null? env.bedrift:"")} <p>Åpningstider, behandlinger, våre ansatte og hvor du finner oss!</p></Link>
  {env.aktivertTimebestilling &&
                <Link onClick={()=>{
                  setSynligmeny(false);
                }} to="/timebestilling">Bestill time <p>Reserver time hos oss</p></Link>
  }
                <Link onClick={()=>{
                  setSynligmeny(false);
                }} to="/kontakt-oss">Kontakt oss<p>Ta kontakt via epost, telefon eller sosiale medier</p></Link>
  
                <Link onClick={()=>{
                  setSynligmeny(false);
                }} to="/om-oss">Om oss<p>Bli kjent</p></Link>
  
              </nav >):(
              <Routes>
                {env.aktivertTimebestilling && <Route exact path="/timebestilling" element={(registrertReservasjon?<DinReservasjon env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} registrertReservasjon={registrertReservasjon} />:(env !== null?<Timebestilling env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} />:<div className="laster"></div>))} />}
                <Route exact path="/" element={(env !== null?<Hjem env={env}/>:<div className="laster"></div>)} />
                <Route exact path="/logginn" element={<Login/>} />
                <Route exact path="/kontakt-oss" element={(env !== null? <Kontakt env={env}/>:<div className="laster"></div>)}/>
                <Route exact path="/personvaernserklaering-og-brukervilkaar" element={env !== null?<PB env={env}/>:<div className="laster"></div>}/>
                <Route exact path="/om-oss" element={env !== null?<OmOss env={env}/>:<div className="laster"></div>}/>
                
              </Routes>))}
              
          
        </BrowserRouter></>}</>
  );
}

function hentMaaned(maanedInt){
    
  switch(maanedInt){
      case 0: return "Januar"
      case 1: return "Februar"
      case 2: return "Mars"
      case 3: return "April"
      case 4: return "Mai"
      case 5: return "Juni"
      case 6: return "Juli"
      case 7: return "August"
      case 8: return "September"
      case 9: return "Oktober"
      case 10: return "November"
      case 11: return "Desember"
      default: return ""
  }
}

function nesteDag(d = new Date()){
  let currentTime = d.getTime();

  // add 1 day worth of milliseconds (1000ms * 60s * 60m * 24h)
  let oneDay = 1000 * 60 * 60 * 24;
  let newTime = currentTime + oneDay;

  // create a new Date object using the new date in milliseconds
  let newDate = new Date(newTime);
  return hentDato(newDate);
}

function hentDato(d = new Date()){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return (`${year}-${month}-${day}`);
  
}

export default App;
export{
  hentDato,
  hentMaaned,
  nesteDag
}