import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import ViErBareLinnea from './pages/bareLinnea'
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



  useEffect(()=>{
    async function fetchData(){
      const request = await fetch('http://localhost:3001/timebestilling/hentBestiltetimer');
      const response = await request.json();
      setBestiltetimer(response);

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
              }} to="/">VI ER bareLinnea <p>Bli kjent</p></Link>
              <Link onClick={()=>{
                setSynligmeny(false);
              }} to="/timebestilling">Bestill time <p>Reserver time hos oss</p></Link>
            </div>):(
            <Routes>
              <Route exact path="/timebestilling" element={(registrertReservasjon?<DinReservasjon hentMaaned={hentMaaned} setReservasjon={setReservasjon} registrertReservasjon={registrertReservasjon} />:<Timebestilling synligKomponent={synligKomponent} setSynligKomponent={setSynligKomponent} hentMaaned={hentMaaned} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} bestilteTimer={bestilteTimer} navn={navn} sNavn={setNavn} telefonnummer={telefonnummer} sTelefonnummer={setTelefonnummer} klokkeslettet={klokkeslettet} sKlokkeslett={setKlokkeslett} sDato={setDato} dato={dato} produkt={produkt} sProdukt={setProdukt} frisor={frisor} sFrisor={setFrisor}/>)} />
              <Route exact path="/" element={<ViErBareLinnea/>} />
              <Route exact path="/login" element={<Login/>} />
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