import React from 'react'
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
        sTelefonnummer(0);
    }

    function displayKomponent(componentIndex){
        console.log(componentIndex);
        setSynligKomponent(componentIndex);
    }

    return (

    <div className='timebestilling'>
        <div>
            
            <h2 className='overskrift'>Velg din time</h2>
            {(synligKomponent === 0? (<Dato synligKomponent={synligKomponent} displayKomponent={displayKomponent} sDato={sDato} sKlokkeslett={sKlokkeslett} sProdukt={sProdukt} klokkeslettet={klokkeslettet} produkt={produkt} hentDato={hentDato} />):"")}

            <h2 className='overskrift'>Velg frisør</h2>
            {(synligKomponent === 1? <Frisor synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor} sProdukt={sProdukt}/>:"")}
           
            <h2 className='overskrift'>Hva ønsker du å reservere time for?</h2>
            {(synligKomponent === 2? <Tjenester synligKomponent={synligKomponent} displayKomponent={displayKomponent} produkt={produkt} sProdukt={sProdukt} frisor={frisor} />:"")}
           
            <h2 className='overskrift'>Velg klokkeslett for timen her:</h2>
            {(frisor !== 0 && produkt.length > 0 && synligKomponent === 3?<Klokkeslett synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
            
            <h2 className='overskrift'>Din info:</h2>
            {(klokkeslettet != null && produkt.length > 0 && synligKomponent === 4?<PersonInfo synligKomponent={synligKomponent} displayKomponent={displayKomponent} telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
                dato:dato, 
                tidspunkt:klokkeslettet,
                frisor:frisorer.indexOf(frisor),
                behandlinger:produkt,
                medarbeider: frisorer[frisorer.indexOf(frisor)].navn,
                telefonnummer: telefonnummer,
                kunde:navn
            }} />:"")}

        </div>

        <div>
            <p>{(dato != null?`Din valgte dato er ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`:"")}</p>
            <p>{(frisor != null?`Du har valgt ${frisor.navn}`:"")}</p>
            <p>{(produkt.length > 0? `Du har valgt: ${produkt.join(", ")}`:"")}</p>
            <p>{(klokkeslettet != null && produkt.length > 0?`Valgt klokkeslett er ${klokkeslettet}`:"")}</p>
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
