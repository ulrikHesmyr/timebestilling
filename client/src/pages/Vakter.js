import React, {useState, useEffect} from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import { hentMaaned } from '../App'

import {klokkeslettFraMinutter, minutterFraKlokkeslett} from '../components/Klokkeslett'

const localizer = momentLocalizer(moment);

function Vakter({env, bestilteTimer}){
  
  const frisornavn = env.frisorer.map(frisor=>frisor.navn);

    const farger = ["darkblue", "cadetblue", "chartreuse", "coral", "mediumorchid"];
    const ukedag = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
    const [ansatt, setAnsatt] = useState(frisornavn);


    const [isMobile, setisMobile] = useState(false);
    useEffect(()=>{
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            setisMobile(true);
          }
    },[]);

    const vakterTimebestillinger = bestilteTimer.map((time)=>{
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
    const MIN_DATE = new Date(2020, 0, 1, 8, 0, 0); // 08:00
    const MAX_DATE = new Date(2020, 0, 1, 17, 30, 0); // 17:30

    let formats = {
      timeGutterFormat: 'HH:mm',
    }
    return(
        <div className='vaktpanel'>
          <h3>Velg vakter for:</h3>
        <div className='velgFrisorVakter'>
        {env.frisorer.map((frisorElement)=>(
          <div key={frisorElement.navn} style={{backgroundColor:farger[env.frisorer.indexOf(frisorElement)]}} onClick={()=>{
            setAnsatt(frisorElement.navn);
          }} >{frisorElement.navn}</div>
        ))}
        <div style={{color:"black"}} onClick={()=>{
            setAnsatt(frisornavn);
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
              backgroundColor: farger[event.frisor]
            },
            className: 'eventWrapper'

          };
        }}/> 
        </div>
    )
}

export default React.memo(Vakter);