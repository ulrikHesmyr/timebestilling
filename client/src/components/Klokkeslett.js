import React, {useEffect, useState} from 'react'
import Fortsett from './Fortsett';
import { hentDato } from '../App';

function Klokkeslett({env, sForsteFrisor, friElementer, tilgjengeligeFrisorer, displayKomponent, klokkeslettet, produkt, bestilteTimer, sKlokkeslett, dato, hentMaaned, frisor}){
    
    const [ledigeTimer, setLedigeTimer] = useState([]);


    useEffect(()=>{
        

        let aapningstider = [];
        
        let frisorerVelgImellom;
        let ledigeTotalt = [];
        //Sjekker åpningstider for den gjeldende dagen i uka
        let gjeldendeDag = env.klokkeslett[new Date(dato).getDay()];
        if(gjeldendeDag.stengt === false){ 
            for(let i = minutterFraKlokkeslett(gjeldendeDag.open); i <= minutterFraKlokkeslett(gjeldendeDag.closed);i+=15){
                aapningstider.push(klokkeslettFraMinutter(i))
            }
        }

        //Finner ut hvor lang tid kundes behandling tar
        let total = env.tjenester.filter(element=>produkt.includes(element)).reduce((total, element)=> total + element.tid, 0);
        
        

        if(frisor === false){
            frisorerVelgImellom = tilgjengeligeFrisorer;
        } else {
            frisorerVelgImellom = [frisor];
        }

        for(let n = 0; n < frisorerVelgImellom.length; n++){
            let ekstra = [];
            let utilgjengelige = [];
            //Finner tidspunkter som er reservert fra før og hvilke som er utilgjengelige pga behandlingstid
            let reserverte = bestilteTimer.map(element =>{
                if(element.dato === dato && element.medarbeider === frisorerVelgImellom[n].navn){
                    let okkupertTid = env.tjenester.filter(tjeneste=>element.behandlinger.includes(tjeneste.navn)).reduce((totalen, minutterFraTjeneste)=> totalen + minutterFraTjeneste.tid, 0);
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

            //Sjekker fritimene for personen
            let friTimene = friElementer.filter(element=>element.medarbeider === frisorerVelgImellom[n].navn);
            
            for(let k = 0; k < friTimene.length; k++){
                
                if(friTimene[k].lengreTid){
                    let d = new Date(dato);
                    let st = new Date(friTimene[k].fraDato);
                    let sl = new Date(friTimene[k].tilDato);
                    if(st <= d && d <= sl){
                        reserverte = reserverte.concat(aapningstider);
                    }
                } else {
                    if(dato === friTimene[k].friDag){
                        for(let i = minutterFraKlokkeslett(friTimene[k].fraKlokkeslett); i < minutterFraKlokkeslett(friTimene[k].tilKlokkeslett); i+=15){
                            reserverte.push(klokkeslettFraMinutter(i));
                        }
                    }
                }
            }
            

            //Sjekker hvilke tidspunkter som kunde ikke kan reservere slik at timer ikke kolliderer m hverandre
            for(let i = 0; i < aapningstider.length; i++){
                if(!utilgjengelige.includes(aapningstider[i])){
                    for(let j = 0; j < reserverte.length; j++){
                        if((minutterFraKlokkeslett(reserverte[j]) > minutterFraKlokkeslett(aapningstider[i]) && (minutterFraKlokkeslett(aapningstider[i])+total) > minutterFraKlokkeslett(reserverte[j]))){
                            utilgjengelige.push(aapningstider[i]);
                        }
                    }
                    if((minutterFraKlokkeslett(aapningstider[i])+total) > minutterFraKlokkeslett(aapningstider[aapningstider.length -1])){
                        utilgjengelige.push(aapningstider[i]);
                    }
                }
            }

            //Passer også på at kunde ikke med uhell reserverer tidspunkt som har vært tidligere samme dag
            let klokkeslettminutterNaa = minutterFraKlokkeslett(`${new Date().getHours()}:${new Date().getMinutes()}`);

            //Sjekker for tidspunktene som allerede er i ledigeTotalt
            let ledigeTotaltTidspunkter = ledigeTotalt.map(ledig=>ledig.tid);

            //Gjør sånn at ingen kan reservere time hos en frisør etter oppsigelsesdatoen
            if(frisorerVelgImellom[n].oppsigelse !== "Ikke oppsagt"){
                let oppsigelsesDato = new Date(frisorerVelgImellom[n].oppsigelse);
                let valgtDato = new Date(dato);
                if(valgtDato >= oppsigelsesDato){
                    continue;
                }

            }


            //Finner til slutt de gjenværende ledige tidspunktene for den enkelte frisøren
            const ledige = aapningstider.map((element)=>{
                if(hentDato() === dato && minutterFraKlokkeslett(element) < klokkeslettminutterNaa){
                    return undefined;
                } else if(!reserverte.includes(element) && !utilgjengelige.includes(element)){
                    if(ledigeTotaltTidspunkter.includes(element)){
                        ledigeTotalt.find(tidspunkt=>tidspunkt.tid===element).frisorer = ledigeTotalt.find(tidspunkt=>tidspunkt.tid===element).frisorer.concat([frisorerVelgImellom[n]]);
                        return undefined
                    } else {
                        return {frisorer:[frisorerVelgImellom[n]], tid:element};
                    }
                } else {
                    return undefined
                }
            }).filter(tid=> tid);

            ledigeTotalt = ledigeTotalt.concat(ledige);

        }

        ledigeTotalt = ledigeTotalt.sort((a,b)=>{
            if(minutterFraKlokkeslett(a.tid) > minutterFraKlokkeslett(b.tid)){
                return 1;
            } else if(minutterFraKlokkeslett(a.tid) < minutterFraKlokkeslett(b.tid)){
                return -1;
            } else {
                return 0;
            }
        })
        setLedigeTimer(ledigeTotalt);

    }, [dato, friElementer, produkt, env.klokkeslett, env.tjenester, frisor, env.frisorer, bestilteTimer, tilgjengeligeFrisorer])

    return(
        <div className="animer-inn">
            <div className='klokkeslettene'>
                {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div style={{backgroundColor: klokkeslettet===tid.tid ?"var(--farge5)": "white"}} className='klokkeslett' key={tid.tid} onClick={()=>{
                    //Velg frisør, sett random ut ifra klokkeslettet, altså tid bruk random som velger random indeks fra tid.frisorer
                    let randomFrisor = tid.frisorer[randomNumber(tid.frisorer.length)];
                    sForsteFrisor(randomFrisor);
                    sKlokkeslett(tid.tid);
                }}> {tid.tid} </div>)):(frisor !== false && frisor.oppsigelse !== "Ikke oppsagt"?"Kan ikke reservere time hos ansatt etter oppsigelsesdatoen":`Ingen ledige timer for ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`))}
            </div>
            
            <Fortsett displayKomponent={displayKomponent} previous={2} number={3} disabled={(klokkeslettet !== null? false:true)} />
        </div>
    )
}

export function randomNumber(max){
    return Math.floor(Math.random() * max);
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
