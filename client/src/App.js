import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import Hjem from './pages/hjem'
import DinReservasjon from './pages/DinReservasjon'
import Login from './pages/Login'
import './App.css'


const App = ()=> {

  
  
  const [dato, setDato] = useState(hentDato());
  const [produkt, setProdukt] = useState([]);
  const [frisor, setFrisor] = useState(null);
  const [klokkeslettet, setKlokkeslett] = useState(null);
  const [navn, setNavn] = useState('');
  const [telefonnummer, setTelefonnummer] = useState('');
  const [bestilteTimer, setBestiltetimer] = useState(undefined);
  const [updateDataTrigger, setUpdate] = useState(false);
  const [registrertReservasjon, setReservasjon] = useState(undefined);
  const [synligKomponent, setSynligKomponent] = useState(0);
  const [synligMeny, setSynligmeny] = useState(false);
  const [env, sEnv] = useState(null);
  const [loggetInn, toggleLoggetInn] = useState(false);


  useEffect(()=>{
    async function fetchEnvironment(){
      const environmentRequest = await fetch("http://localhost:3001/env/env");
      const environment = await environmentRequest.json();
      if(environment){
        console.log("Offentlig: må fje", environment);
        sEnv(environment);
      }
    }
    fetchEnvironment();
  },[])

  useEffect(()=>{
    async function fetchData(){

      const request = await fetch('http://localhost:3001/timebestilling/hentBestiltetimer');
      const response = await request.json();
      setBestiltetimer(response);
      console.log(response);

    }
    fetchData();
  },[updateDataTrigger])

  return (
      <BrowserRouter>
        <div>
            <div className='burger' aria-expanded={synligMeny} onClick={()=>{
              setSynligmeny(!synligMeny);
            }}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            {(synligMeny?(
            <div className='navBar' aria-hidden={!synligMeny}>
              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/">VI ER {(env !== null? env.bedrift:"")} <p>Bli kjent</p></Link>
              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/timebestilling">Bestill time <p>Reserver time hos oss</p></Link>
            </div>):(
            <Routes>
              <Route exact path="/timebestilling" element={(registrertReservasjon?<DinReservasjon env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} registrertReservasjon={registrertReservasjon} />:(env !== null?<Timebestilling env={env} synligKomponent={synligKomponent} setSynligKomponent={setSynligKomponent} hentMaaned={hentMaaned} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} bestilteTimer={bestilteTimer} navn={navn} sNavn={setNavn} telefonnummer={telefonnummer} sTelefonnummer={setTelefonnummer} klokkeslettet={klokkeslettet} sKlokkeslett={setKlokkeslett} sDato={setDato} dato={dato} produkt={produkt} sProdukt={setProdukt} frisor={frisor} sFrisor={setFrisor}/>:"Laster..."))} />
              <Route exact path="/" element={(env !== null?<Hjem env={env}/>:"Laster...")} />
              <Route exact path="/login" element={<Login loggetInn={loggetInn} toggleLoggetInn={toggleLoggetInn} env={env}/>} />
            </Routes>))}
            
        </div>
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
  hentDato
}