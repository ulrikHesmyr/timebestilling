import React, {useState, useMemo, useEffect} from 'react'
import { hentMaaned } from '../App';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'

import {klokkeslettFraMinutter, minutterFraKlokkeslett} from '../components/Klokkeslett'

const localizer = momentLocalizer(moment);

function Vakter({env, bestilteTimer}){
    //const farger = ["yellow", "cadetblue", "chartreuse", "coral", "mediumorchid"];
    //const [ansatt, setAnsatt] = useState(env.frisorer.map(frisor=>frisor.navn));
    console.log(bestilteTimer);
    const [isMobile, setisMobile] = useState(false);
    useEffect(()=>{
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            setisMobile(true);
          }
    },[]);

    const events = [
        {
        title:"heihei",
        start: new Date("2023-01-07Z08:00:000+1:00"),
        end: new Date("2023-01-07Z09:00:000+1:00")
        }
    ]
    console.log(bestilteTimer);
    const vakterTimebestillinger = bestilteTimer.map((time)=>{
        const gjeldendeTjenester = env.tjenester.filter(tjeneste => time.behandlinger.includes(tjeneste.navn)).reduce((total, element)=> total + element.tid, 0);
        console.log(gjeldendeTjenester, time.behandlinger);
        time.start = new Date(`${time.dato}Z${time.tidspunkt}:000+1:00`);
        time.end = new Date(`${time.dato}Z${klokkeslettFraMinutter(gjeldendeTjenester+minutterFraKlokkeslett(time.tidspunkt))}:000+1:00`);
        time.title = `Behandlinger: ${time.behandlinger.join(", ")} Frisør: ${time.medarbeider} Kunde: ${time.kunde}, tlf.: ${time.telefonnummer}`
        time.color = "coralblue"
        return time
    }) 

    console.log(vakterTimebestillinger);
    const MIN_DATE = new Date(2020, 0, 1, 8, 0, 0); // 8AM
    const MAX_DATE = new Date(2020, 0, 1, 17, 30, 0); // 5PM

    
    return(
        <>
        <Calendar
        components={{
            event: ({event}) => (
              <div style={{backgroundColor: event.color}}>
                {event.title}
              </div>
            )
          }}
        min={MIN_DATE} max={MAX_DATE} events={vakterTimebestillinger} defaultDate={new Date()} defaultView="day" 
        localizer={localizer} startAccessor="start" endAccessor="end" style={{height:"80vh", margin: "50px"}}
        dateFormat="H:mm" /> 
        </>
    )
}

export default React.memo(Vakter);