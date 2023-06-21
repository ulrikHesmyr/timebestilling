import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import DinReservasjon from './pages/DinReservasjon'
import Login from './pages/Login'
import './App.css'


const App = ()=> {
  
  const [synligMeny, setSynligmeny] = useState(false);
  const [env, sEnv] = useState(null);
  const [registrertReservasjon, setReservasjon] = useState(undefined);

  useEffect(()=>{

    const fetchEnvironment = async ()=>{
      const data = await (
        await fetch("http://localhost:1228/env/env")
      ).json();
      if(data){
        sEnv(data);
      }
    }
    
    fetchEnvironment();

  }, [])


  return (
    <>{env !== null && <>  
          <BrowserRouter>
              
              <Routes>
                 <Route exact path="/" element={(registrertReservasjon?<DinReservasjon env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} registrertReservasjon={registrertReservasjon} />:(env !== null?<Timebestilling env={env} hentMaaned={hentMaaned} setReservasjon={setReservasjon} />:<div className="laster"></div>))} />
                <Route exact path="/logginn" element={<Login/>} />
                
                
              </Routes>
              
          
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