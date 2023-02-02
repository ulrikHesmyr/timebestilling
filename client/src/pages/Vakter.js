import React, {useState, useEffect} from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import { hentMaaned } from '../App'

import {klokkeslettFraMinutter, minutterFraKlokkeslett} from '../components/Klokkeslett'

const localizer = momentLocalizer(moment);

function Vakter({env, bestilteTimer, bruker}){
  
    const farger = ["darkblue", "cadetblue", "chartreuse", "coral", "mediumorchid", "indigo","red","black","purple","peru", "burylwood"];
    const ukedag = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
    const [ansatt, setAnsatt] = useState([]);
    const [vakterTimebestillinger, sVakterTimebestillinger] = useState();
    
    //Redigere ansatt info
    const [visRedigerTelefonnummer, sVisRedigerTelefonnummer] = useState(false);
    const [visInnstillinger, sVisInnstillinger] = useState(false);


    const [nyttTlf, sNyttTlf] = useState("");
    const [lagretTlf, sLagretTlf] = useState(bruker.telefonnummer);
  



    const [isMobile, setisMobile] = useState(false);

    useEffect(()=>{
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            setisMobile(true);
          }
        let j = env.frisorer.map(e=>e.navn)
        setAnsatt(j);
    },[env.frisorer]);


    useEffect(()=>{

      //Alle bestillinger som skal inn i vakter-kalenderen
      console.log("ansatt",ansatt);
      const v = bestilteTimer.map((time)=>{
      if(ansatt.includes(time.medarbeider)){
        const gjeldendeTjenester = env.tjenester.filter(tjeneste => time.behandlinger.includes(tjeneste.navn)).reduce((total, element)=> total + element.tid, 0);
        time.start = new Date(`${time.dato}Z${time.tidspunkt}+1:00`);
        time.end = new Date(`${time.dato}Z${klokkeslettFraMinutter(gjeldendeTjenester+minutterFraKlokkeslett(time.tidspunkt))}+1:00`);
        time.slutt = klokkeslettFraMinutter(minutterFraKlokkeslett(time.tidspunkt)+gjeldendeTjenester);
        time.title = `${time.medarbeider.toUpperCase()}, ${time.behandlinger.join(", ")} Kunde: ${time.kunde}, tlf.: ${time.telefonnummer}`
        return time;
      }
      return undefined;
      }).filter(x=>x) 
      sVakterTimebestillinger(v);

    },[ansatt, bestilteTimer, bruker.navn, env.frisorer, env.tjenester]);

    const MIN_DATE = new Date(2020, 0, 1, 8, 0, 0); // 08:00
    const MAX_DATE = new Date(2020, 0, 1, 17, 30, 0); // 17:30

    let formats = {
      timeGutterFormat: 'HH:mm',
    }

    async function oppdaterTelefonnummer(){
      if(!isNaN(parseInt(nyttTlf)) && nyttTlf.length === 8){
        //Sender en request til serveren for å endre telefonnummeret til den ansatte
        const options = {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({telefonnummer: parseInt(nyttTlf)})
        };

        const request = await fetch("http://localhost:3001/login/oppdaterTelefonnummer", options);
        const response = await request.json();
        if(response){
          console.log(response);
          sLagretTlf(nyttTlf);
        }
      }
    }

    return(
        <div className='vaktpanel'>
          <div style={{display:"flex", flexDirection:"row"}}>
          <p>Logget inn som: {bruker.navn}</p><button onClick={(e)=>{
            e.preventDefault();
            sVisInnstillinger(!visInnstillinger);
          }}><img src="settings.png" alt="Innstillinger for ansatt" style={{height:"1.4rem"}}></img></button></div>
          {visInnstillinger?<>
          
            <p>Ditt telefonnummer: {lagretTlf} 
            {visRedigerTelefonnummer?<>
            <label>Skriv inn nytt telefonnummer: <input value={nyttTlf} maxLength={8} onChange={(e)=>{
              sNyttTlf(e.target.value);
            }}></input> </label>
            <button onClick={(e)=>{
              e.preventDefault();
              sVisRedigerTelefonnummer(false);
              sNyttTlf("");
            }}>Avbryt</button>
            <button onClick={(e)=>{
              e.preventDefault();
              sVisRedigerTelefonnummer(false);
              oppdaterTelefonnummer();
              sNyttTlf("");
            }}>Lagre</button>
            </>:<>
            <button onClick={(e)=>{
              //Redigerer telefonnummer
              e.preventDefault();
              sVisRedigerTelefonnummer(true);
            }}>
              <img src="rediger.png" alt="Rediger telefonnummer" style={{height:"1.4rem"}}></img>
            </button>(brukes kun for tofaktorautentisering)</>  }
          </p></>:""}
          <h3>Velg vakter for:</h3>
        <div className='velgFrisorVakter'>
        {env.frisorer.map((frisorElement)=>(
          <div key={frisorElement.navn} style={{border:(ansatt === frisorElement.navn? "2px solid black":"none"), backgroundColor:farger[env.frisorer.indexOf(frisorElement)], userSelect:"none"}} onClick={()=>{
            setAnsatt(frisorElement.navn);
          }} >{frisorElement.navn}</div>
        ))}
        <div style={{color:"black", borderBottom:"thin solid black"}} onClick={()=>{
            let alleFrisorenesNavn = env.frisorer.map(frisor=>frisor.navn);
            setAnsatt(alleFrisorenesNavn);
          }} >ALLE</div>
        </div>
        <p>PS Trykk på timen dersom det som står, ikke er leselig</p>
        
        <Calendar format={"DD/MM/YYYY HH:mm"}
        components={{
            event: ({event}) => (
              <div onClick={()=>{
                alert(`${ukedag[new Date(event.dato).getDay() -1]} ${parseInt(event.dato.substring(8,10))}. ${hentMaaned(parseInt(event.dato.substring(5,7)) -1)} ${event.tidspunkt}-${event.slutt} ${event.title}  `)
              }}>
                {event.tidspunkt}-{event.slutt}: {event.title}
              </div>
            )
          }}
        formats={formats}
        min={MIN_DATE} max={MAX_DATE} events={vakterTimebestillinger} defaultDate={new Date()} defaultView="day" 
        views={["agenda", "day","week","month"]}
        localizer={localizer} startAccessor="start" endAccessor="end" style={{height:(isMobile?"150vh":"100vh"), margin:"5px"}}
        eventPropGetter={event => {
          return {
            style:{ 
              backgroundColor: farger[event.frisor],
              padding:"0.05rem"
            },
            className: 'eventWrapper'

          };
        }}/> 
        </div>
    )
}

export default React.memo(Vakter);