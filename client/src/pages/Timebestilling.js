import React, { useRef, useEffect} from 'react'
import Tjenester from '../components/Tjenester';
import Klokkeslett from '../components/Klokkeslett';
import Frisor from '../components/Frisor';
import PersonInfo from '../components/PersonInfo';
import { frisorer } from '../shared/env';

export default function Timebestilling({hentMaaned, setReservasjon, setUpdate, updateDataTrigger, bestilteTimer, navn, sNavn, telefonnummer, sTelefonnummer, klokkeslettet, sKlokkeslett, sDato, dato, produkt, sProdukt, frisor, sFrisor}){

    const tjenesteliste = useRef(null);
    const frisorListe = useRef(null);
    const valgtDatoTekst = useRef(null);
    const valgtFrisorTekst = useRef(null);
    const valgtProduktTekst = useRef(null);
    const valgtTidspunktTekst = useRef(null);
    
    function nullstillData(){
        sDato(null);
        sProdukt([]);
        sFrisor(null);
        sKlokkeslett(null);
        sNavn('');
        sTelefonnummer(0);
    }

    useEffect(()=>{
        valgtDatoTekst.current.scrollIntoView({
            behavior:'smooth',
            block:'start'
        })
        console.log("dato");
    }, [dato])
    useEffect(()=>{
        valgtProduktTekst.current.scrollIntoView({
            behavior:'smooth',
            block:'start'
        })
        console.log("produkt");
    }, [produkt])
    useEffect(()=>{
        valgtFrisorTekst.current.scrollIntoView({
            behavior:'smooth',
            block:'start'
        })
        console.log("frisor");
    }, [frisor])
    useEffect(()=>{
        if(produkt.length > 0 && klokkeslettet != null){
            valgtTidspunktTekst.current.scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
            console.log("klokkeslettet");
        }
    }, [klokkeslettet, produkt])

    return (

    <div className='timebestilling'>
    <h1>Velg din time</h1>
    <input type="date" min={hentDato()} onChange={(e)=>{
        if(produkt.length > 0 || klokkeslettet != null){
            sProdukt([]);
            sKlokkeslett(null);
        }
        sDato(e.target.value);
    }}></input>
    <p ref={valgtDatoTekst}>{(dato != null?`Din valgte dato er ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`:"")}</p>
    
    <div ref={frisorListe}>
        {(dato != null? <Frisor sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor} tjenesteliste={tjenesteliste} sProdukt={sProdukt}/>:"")}
    </div>
    <p ref={valgtFrisorTekst}>{(frisor != null?`Du har valgt ${frisor.navn}`:"")}</p>

    <div ref={tjenesteliste}>
        {(frisor!=null? <Tjenester produkt={produkt} sProdukt={sProdukt} frisor={frisor} />:"")}
    </div>
    <p ref={valgtProduktTekst}>{(produkt.length > 0? `Du har valgt: ${produkt.join(", ")}`:"")}</p>

    <div>
        {(produkt.length > 0?<Klokkeslett produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
    </div>
    <p ref={valgtTidspunktTekst}>{(klokkeslettet != null?`Valgt klokkeslett er ${klokkeslettet}`:"")}</p>

    <div>
        {(klokkeslettet != null?<PersonInfo telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
        dato:dato, 
        tidspunkt:klokkeslettet,
        frisor:frisorer.indexOf(frisor),
        behandlinger:produkt,
        medarbeider: frisorer[frisorer.indexOf(frisor)].navn,
        telefonnummer: telefonnummer,
        kunde:navn
    }} />:"")}
    </div>
    </div>
        )
}

export function Kvittering(){

    return (
        <>
        <p>Kvittering</p>
        </>
    )
}


function hentDato(){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return (`${year}-${month}-${day}`);
    
}
