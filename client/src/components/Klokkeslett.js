import React from 'react'
import Fortsett from './Fortsett';
import { hentDato } from '../App';

function Klokkeslett({env, synligKomponent, displayKomponent, klokkeslettet, produkt, bestilteTimer, sKlokkeslett, dato, hentMaaned, frisor}){
    const gjeldendeTjenester = env.tjenester.filter(element=>produkt.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    

    let ekstra = [];
    const klokkeslettminutterNaa = minutterFraKlokkeslett(`${new Date().getHours()}:${new Date().getMinutes()}`);
    
    //while(minutter < (minutterFraKlokkeslett(element.tidspunkt) + totalTid-30)){
    //    minutter+=30;
    //    utilgjengeligeTimer.push(klokkeslettFraMinutter(minutter));
    //}
    const reserverteTimer = bestilteTimer.map(element =>{
        if(element.dato === dato && element.frisor === env.frisorer.indexOf(frisor)){
            let okkupertTid = env.tjenester.filter(tjeneste=>element.behandlinger.includes(tjeneste.navn)).reduce((total, minutterFraTjeneste)=> total + minutterFraTjeneste.tid, 0);
            let minutter = minutterFraKlokkeslett(element.tidspunkt);
            while(minutter < (minutterFraKlokkeslett(element.tidspunkt) + okkupertTid-15)){
                minutter+=15;
                ekstra.push(klokkeslettFraMinutter(minutter));
            }
            return element.tidspunkt;
        } else {
            return undefined
        }
    }).filter(x => x).concat(ekstra);

    let utilgjengeligeTimer = [];
    for(let i = 0; i < env.klokkeslett.length; i++){
        for(let j = 0; j < reserverteTimer.length; j++){
            if( minutterFraKlokkeslett(reserverteTimer[j]) > minutterFraKlokkeslett(env.klokkeslett[i]) && (minutterFraKlokkeslett(env.klokkeslett[i])+totalTid) > minutterFraKlokkeslett(reserverteTimer[j])){
                utilgjengeligeTimer.push(env.klokkeslett[i]);
            }
        }
    }




    const ledigeTimer = env.klokkeslett.map((element)=>{
        if(hentDato() === dato && minutterFraKlokkeslett(element) < klokkeslettminutterNaa){
            return undefined;
        } else {
            return element;
        }
    }).filter(tid=> tid && !reserverteTimer.includes(tid) && !utilgjengeligeTimer.includes(tid));
    return(
        <div className={synligKomponent === 3? 'animer-inn':'animer-ut'}>
            <div className='klokkeslettene'>
                {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div style={{backgroundColor: klokkeslettet===tid ?"lightgreen": "white"}} className='klokkeslett' key={tid} onClick={()=>{
                    sKlokkeslett(tid);
                }}> {tid} </div>)):`Ingen ledige timer for ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`)}
            </div>
            
            <Fortsett displayKomponent={displayKomponent} number={4} valid={(klokkeslettet !== null? false:true)} />
        </div>
    )
}

export function minutterFraKlokkeslett(k){
    return ((parseInt(k.substring(0,2))*60) + parseInt(k.substring(3,5)));
}

export function klokkeslettFraMinutter(n) {
    let number = n;
    let hours = (number / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return `${(rhours<10?`0${rhours}`:rhours)}:${(rminutes<10?`0${rminutes}`:rminutes)}`
    }

export default React.memo(Klokkeslett);
