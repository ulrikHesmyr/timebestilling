import React, {useEffect, useState} from 'react'
import Tjenester from '../components/Tjenester';
import Klokkeslett from '../components/Klokkeslett';
import Frisor from '../components/Frisor';
import PersonInfo from '../components/PersonInfo';
import Dato from '../components/Dato';
import { frisorer } from '../shared/env';

export default function Timebestilling({setSynligKomponent, synligKomponent, hentMaaned, setReservasjon, setUpdate, updateDataTrigger, bestilteTimer, navn, sNavn, telefonnummer, sTelefonnummer, klokkeslettet, sKlokkeslett, sDato, dato, produkt, sProdukt, frisor, sFrisor}){
    
    function nullstillData(){
        sDato(null);
        sProdukt([]);
        sFrisor(null);
        sKlokkeslett(null);
        sNavn('');
        sTelefonnummer('');
    }

    function displayKomponent(componentIndex){
        console.log(componentIndex);
        setSynligKomponent(componentIndex);
    }
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent;
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    }, []);

    return (

    <div className='timebestilling'>
        <div>
            
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 0){
                    displayKomponent(-1);
                } else {
                    displayKomponent(0);
                }
            }} style={{backgroundColor: dato !== null?"lightgreen":"white"}} ><p>1</p> Velg din time</h2>
            {(synligKomponent === 0? (<Dato synligKomponent={synligKomponent} displayKomponent={displayKomponent} sDato={sDato} sKlokkeslett={sKlokkeslett} sProdukt={sProdukt} klokkeslettet={klokkeslettet} produkt={produkt} hentDato={hentDato} />):"")}
            
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 1){
                    displayKomponent(-1);
                } else {
                    displayKomponent(1);
                }
            }} style={{backgroundColor: frisor !== null?"lightgreen":"white"}}><p>2</p>Velg frisør</h2>
            {(synligKomponent === 1? <Frisor synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor} sProdukt={sProdukt}/>:"")}
           
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 2){
                    displayKomponent(-1);
                } else {
                    displayKomponent(2);
                }
            }} style={{backgroundColor: produkt.length > 0?"lightgreen":"white"}}><p>3</p>Behandlinger</h2>
            {(synligKomponent === 2? <Tjenester synligKomponent={synligKomponent} displayKomponent={displayKomponent} produkt={produkt} sProdukt={sProdukt} frisor={frisor} />:"")}
           
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 3){
                    displayKomponent(-1);
                } else {
                    displayKomponent(3);
                }
            }} style={{backgroundColor: klokkeslettet !== null?"lightgreen":"white"}}><p>4</p>Velg klokkeslett for timen her</h2>
            {(frisor !== 0 && produkt.length > 0 && synligKomponent === 3?<Klokkeslett synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
            
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 4){
                    displayKomponent(-1);
                } else {
                    displayKomponent(4);
                }
            }} style={{backgroundColor: navn !== "" && telefonnummer.toString().length === 8?"lightgreen":"white"}}><p>5</p>Din info</h2>
            {(klokkeslettet != null && produkt.length > 0 && synligKomponent === 4?<PersonInfo isMobile={isMobile} synligKomponent={synligKomponent} displayKomponent={displayKomponent} telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
                dato:dato, 
                tidspunkt:klokkeslettet,
                frisor:frisorer.indexOf(frisor),
                behandlinger:produkt,
                medarbeider: frisorer[frisorer.indexOf(frisor)].navn,
                telefonnummer: parseInt(telefonnummer),
                kunde:navn
            }} />:"")}

        </div>

        <div className='infoboks'>
            <div>
            <h3>Din timebestilling</h3>
            <div>Dato {(dato != null?(<p>{parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</p>):"")}</div>
            <div>Frisør {(frisor != null?(<p>{frisor.navn}</p>):"")}</div>
            <div>Time for {(produkt.length > 0?(<p>{produkt.join(", ")}</p>):"")}</div>
            <div>Tid {(klokkeslettet != null && produkt.length > 0?(<p>{klokkeslettet}</p>):"")}</div>
            </div>
            <p>obs.: Prisene er kun estimert og kan øke dersom det blir brukt hårprodukter eller om det kreves vask osv.</p>
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
