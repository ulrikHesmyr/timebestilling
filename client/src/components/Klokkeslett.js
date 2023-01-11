import React, {useEffect, useState} from 'react'
import Fortsett from './Fortsett';
import { hentDato } from '../App';

function Klokkeslett({env, synligKomponent, displayKomponent, klokkeslettet, produkt, bestilteTimer, sKlokkeslett, dato, hentMaaned, frisor}){
    
    const [ledigeTimer, setLedigeTimer] = useState([]);


    useEffect(()=>{
        let ledigea = [];
        let gjeldendeDag = env.klokkeslett[new Date(dato).getDay() - 1];
        if(new Date(dato).getDay() !== 0){ 
            for(let i = minutterFraKlokkeslett(gjeldendeDag.open); i <= minutterFraKlokkeslett(gjeldendeDag.closed);i+=15){
                ledigea.push(klokkeslettFraMinutter(i))
            }
        }
        console.log(ledigea);
        let total = env.tjenester.filter(element=>produkt.includes(element)).reduce((total, element)=> total + element.tid, 0);
        
        
        let ekstra = [];
        let reserverte = bestilteTimer.map(element =>{
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
        
        let utilgjengelige = [];
        for(let i = 0; i < ledigea.length; i++){
            if(!utilgjengelige.includes(ledigea[i])){
                for(let j = 0; j < reserverte.length; j++){
                    if((minutterFraKlokkeslett(reserverte[j]) > minutterFraKlokkeslett(ledigea[i]) && (minutterFraKlokkeslett(ledigea[i])+total) > minutterFraKlokkeslett(reserverte[j]))){
                        utilgjengelige.push(ledigea[i]);
                    }
                }
                if((minutterFraKlokkeslett(ledigea[i])+total) > minutterFraKlokkeslett(ledigea[ledigea.length -1])){
                    utilgjengelige.push(ledigea[i]);
                }
            }
        }

        
        let klokkeslettminutterNaa = minutterFraKlokkeslett(`${new Date().getHours()}:${new Date().getMinutes()}`);
        
        const ledige = ledigea.map((element)=>{
            if(hentDato() === dato && minutterFraKlokkeslett(element) < klokkeslettminutterNaa){
                return undefined;
            } else {
                return element;
            }
        }).filter(tid=> tid && !reserverte.includes(tid) && !utilgjengelige.includes(tid));

        setLedigeTimer(ledige);
        console.log(reserverte);
        console.log(utilgjengelige);
        console.log(ledige);
    }, [dato, produkt, env.klokkeslett, env.tjenester, frisor, env.frisorer, bestilteTimer])

    return(
        <div className="animer-inn">
            <div className='klokkeslettene'>
                {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div style={{backgroundColor: klokkeslettet===tid ?"lightgreen": "white"}} className='klokkeslett' key={tid} onClick={()=>{
                    sKlokkeslett(tid);
                }}> {tid} </div>)):`Ingen ledige timer for ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`)}
            </div>
            
            <Fortsett displayKomponent={displayKomponent} number={3} disabled={(klokkeslettet !== null? false:true)} />
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
