import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import Hjem from './pages/hjem'
import DinReservasjon from './pages/DinReservasjon'
import Login from './pages/Login'
import './App.css'
import Kontakt from './pages/Kontakt'
import PB from './pages/Personvern_Brukervilkaar'


const App = ()=> {
  
  const [synligMeny, setSynligmeny] = useState(false);
  const [env, sEnv] = useState(null);
  const [registrertReservasjon, setReservasjon] = useState(undefined);


  useEffect(()=>{
    async function fetchEnvironment(){
      const environmentRequest = await fetch("http://localhost:1226/env/env");
      const environment = await environmentRequest.json();
      if(environment){
        sEnv(environment);
      }
    }
    fetchEnvironment();

  },[])


  return (
      <BrowserRouter><div style={{borderBottom:"thin solid black", display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"1rem"}}>
        
        <div id="burgerButton" className='burger' aria-label='Vis navigasjonsmeny' aria-expanded={synligMeny} aria-controls="navigation" onClick={()=>{
              setSynligmeny(!synligMeny);
            }}>
              <div></div>
              <div></div>
              <div></div>
            </div>
      </div>
            {(synligMeny?(
            <nav id="navigation" className='navBar' role="region" aria-labelledby='burgerButton' aria-hidden={!synligMeny}>
              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/">VI ER {(env !== null? env.bedrift:"")} <p>Bli kjent</p></Link>

              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/timebestilling">Bestill time <p>Reserver time hos oss</p></Link>

              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/kontakt-oss">Kontakt oss<p>Ta kontakt via epost, telefon eller sosiale medier</p></Link>
            </nav >):(
            <Routes>
              <Route exact path="/timebestilling" element={(registrertReservasjon?<DinReservasjon env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} registrertReservasjon={registrertReservasjon} />:(env !== null?<Timebestilling env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} />:"Laster..."))} />
              <Route exact path="/" element={(env !== null?<Hjem env={env}/>:"Laster...")} />
              <Route exact path="/logginn" element={<Login/>} />
              <Route exact path="/kontakt-oss" element={(env !== null? <Kontakt env={env}/>:"Laster...")}/>
              <Route exact path="/personvaernserklaering-og-brukervilkaar" element={env !== null?<PB env={env}/>:"Laster..."}/>
            </Routes>))}
            
        
      </BrowserRouter>
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


function hentDato(){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return (`${year}-${month}-${day}`);
  
}

export default App;
export{
  hentDato,
  hentMaaned
}