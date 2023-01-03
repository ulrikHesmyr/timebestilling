import React from 'react'
import { klokkeslett, frisorer, tjenester } from '../shared/env'

function Klokkeslett({produkt, bestilteTimer,sKlokkeslett, dato, hentMaaned, frisor}){
//Fjerne bestilte tidspunkter fra ledige klokkeslett
    console.log(bestilteTimer);
    const gjeldendeTjenester = tjenester.filter(element=>produkt.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    console.log(totalTid, "totalTid");
    

    let ekstra = [];
    
    //while(minutter < (minutterFraKlokkeslett(element.tidspunkt) + totalTid-30)){
    //    minutter+=30;
    //    utilgjengeligeTimer.push(klokkeslettFraMinutter(minutter));
    //}
    const reserverteTimer = bestilteTimer.map(element =>{
        if(element.dato === dato && element.frisor === frisorer.indexOf(frisor)){
            let okkupertTid = tjenester.filter(tjeneste=>element.behandlinger.includes(tjeneste.navn)).reduce((total, minutterFraTjeneste)=> total + minutterFraTjeneste.tid, 0);
            let minutter = minutterFraKlokkeslett(element.tidspunkt);
            while(minutter < (minutterFraKlokkeslett(element.tidspunkt) + okkupertTid-30)){
                minutter+=30;
                ekstra.push(klokkeslettFraMinutter(minutter));
            }
            return element.tidspunkt;
        } else {
            return undefined
        }
    }).filter(x => x).concat(ekstra);

    console.log("reserverte timer: ", reserverteTimer);

    let utilgjengeligeTimer = [];
    for(let i = 0; i < klokkeslett.length; i++){
        for(let j = 0; j < reserverteTimer.length; j++){
            if( minutterFraKlokkeslett(reserverteTimer[j]) > minutterFraKlokkeslett(klokkeslett[i].tid) && (minutterFraKlokkeslett(klokkeslett[i].tid)+totalTid) > minutterFraKlokkeslett(reserverteTimer[j])){
                utilgjengeligeTimer.push(klokkeslett[i].tid);
            }
        }
    }
    console.log(utilgjengeligeTimer);



    const ledigeTimer = klokkeslett.map(element=>element.tid).filter(tid=> !reserverteTimer.includes(tid) && !utilgjengeligeTimer.includes(tid))
    return(
        <div>
        <h2>Velg klokkeslett for timen her:</h2>
        <div className='klokkeslettene'>
            {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div key={tid} onClick={()=>{
                sKlokkeslett(tid)
            }}> {tid} </div>)):`Ingen ledige timer for ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`)}
        </div>
        </div>
    )
}

function minutterFraKlokkeslett(k){
    return ((parseInt(k.substring(0,2))*60) + parseInt(k.substring(3,5)));
}

function klokkeslettFraMinutter(n) {
    let number = n;
    let hours = (number / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return `${(rhours<10?`0${rhours}`:rhours)}:${(rminutes<10?`0${rminutes}`:rminutes)}`
    }

export default React.memo(Klokkeslett);