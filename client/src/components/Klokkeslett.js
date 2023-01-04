import React from 'react'
import Fortsett from './Fortsett';

function Klokkeslett({env, synligKomponent, displayKomponent, klokkeslettet, produkt, bestilteTimer, sKlokkeslett, dato, hentMaaned, frisor}){
    const gjeldendeTjenester = env.tjenester.filter(element=>produkt.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    

    let ekstra = [];
    
    //while(minutter < (minutterFraKlokkeslett(element.tidspunkt) + totalTid-30)){
    //    minutter+=30;
    //    utilgjengeligeTimer.push(klokkeslettFraMinutter(minutter));
    //}
    const reserverteTimer = bestilteTimer.map(element =>{
        if(element.dato === dato && element.frisor === env.frisorer.indexOf(frisor)){
            let okkupertTid = env.tjenester.filter(tjeneste=>element.behandlinger.includes(tjeneste.navn)).reduce((total, minutterFraTjeneste)=> total + minutterFraTjeneste.tid, 0);
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

    let utilgjengeligeTimer = [];
    for(let i = 0; i < env.klokkeslett.length; i++){
        for(let j = 0; j < reserverteTimer.length; j++){
            if( minutterFraKlokkeslett(reserverteTimer[j]) > minutterFraKlokkeslett(env.klokkeslett[i].tid) && (minutterFraKlokkeslett(env.klokkeslett[i].tid)+totalTid) > minutterFraKlokkeslett(reserverteTimer[j])){
                utilgjengeligeTimer.push(env.klokkeslett[i].tid);
            }
        }
    }



    const ledigeTimer = env.klokkeslett.map(element=>element.tid).filter(tid=> !reserverteTimer.includes(tid) && !utilgjengeligeTimer.includes(tid))
    return(
        <div className={synligKomponent === 3? 'animer-inn':'animer-ut'}>
            <Fortsett displayKomponent={displayKomponent} number={4} valid={(klokkeslettet !== null? false:true)} />
            <div className='klokkeslettene'>
                {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div style={{backgroundColor: klokkeslettet===tid ?"lightgreen": "white"}} className='klokkeslett' key={tid} onClick={()=>{
                    sKlokkeslett(tid);
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