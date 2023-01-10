import React, {useEffect, useState} from 'react'
import Tjenester from '../components/Tjenester';
import Klokkeslett from '../components/Klokkeslett';
import Frisor from '../components/Frisor';
import PersonInfo from '../components/PersonInfo';
import Dato from '../components/Dato';
import { hentDato } from '../App';

function Timebestilling({env, setSynligKomponent, synligKomponent, hentMaaned, setReservasjon, navn, sNavn, telefonnummer, sTelefonnummer, klokkeslettet, sKlokkeslett, sDato, dato, produkt, sProdukt, frisor, sFrisor}){
    
    const [isMobile, setIsMobile] = useState(false);
    const [updateDataTrigger, setUpdate] = useState(false);
    const [bestilteTimer, setBestiltetimer] = useState(undefined);

    function nullstillData(){
        sDato(hentDato());
        sProdukt([]);
        sFrisor(null);
        sKlokkeslett(null);
        sNavn('');
        sTelefonnummer('');
    }

    function displayKomponent(componentIndex){
        setSynligKomponent(componentIndex);
    }

    useEffect(() => {
        const userAgent = window.navigator.userAgent;
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    }, []);
    
  useEffect(()=>{
    async function fetchData(){
      const request = await fetch('http://localhost:3001/timebestilling/hentBestiltetimer');
      const response = await request.json();
      setBestiltetimer(response);
    }
    fetchData();
  },[updateDataTrigger])

    const gjeldendeTjenester = env.tjenester.filter(element=>produkt.includes(element));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);

    return (

    <div className='timebestilling'>
        <div className='container'>
            
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 0){
                    displayKomponent(-1);
                } else {
                    displayKomponent(0);
                }
            }} style={{backgroundColor: produkt.length > 0?"lightgreen":"white"}}><p>1</p>Behandlinger</h2>
            {(synligKomponent === 0 && env !== null? <Tjenester sFrisor={sFrisor} sKlokkeslett={sKlokkeslett} env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} produkt={produkt} sProdukt={sProdukt} frisor={frisor} />:"")}
           
           
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 1){
                    displayKomponent(-1);
                } else {
                    displayKomponent(1);
                }
            }} style={{backgroundColor: frisor !== null?"lightgreen":"white"}}><p>2</p>Velg frisør</h2>
            {(synligKomponent === 1 && produkt.length > 0? <Frisor env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor} sProdukt={sProdukt}/>:"")}
           
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 2){
                    displayKomponent(-1);
                } else {
                    displayKomponent(2);
                }
            }} style={{backgroundColor: dato !== null && klokkeslettet !== null ?"lightgreen":"white"}} ><p>3</p> Velg din time</h2>
            {(synligKomponent === 2 && frisor !== null ? <Dato dato={dato} synligKomponent={synligKomponent} displayKomponent={displayKomponent} sDato={sDato} sKlokkeslett={sKlokkeslett} sProdukt={sProdukt} klokkeslettet={klokkeslettet} produkt={produkt} />:"")}
            {(synligKomponent === 2 && frisor !== null ? <Klokkeslett env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
            
            <h2 className='overskrift' onClick={()=>{
                if(synligKomponent === 3){
                    displayKomponent(-1);
                } else {
                    displayKomponent(3);
                }
            }} style={{backgroundColor: navn !== "" && telefonnummer.toString().length === 8?"lightgreen":"white"}}><p>5</p>Din info</h2>
            {(synligKomponent === 3 && klokkeslettet !== null?<PersonInfo totalPris={totalPris} totalTid={totalTid} klokkeslettet={klokkeslettet} produkt={produkt} frisor={frisor} hentMaaned={hentMaaned} dato={dato} isMobile={isMobile} synligKomponent={synligKomponent} displayKomponent={displayKomponent} telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
                dato:dato, 
                tidspunkt:klokkeslettet,
                frisor: env.frisorer.indexOf(frisor),
                behandlinger:produkt.map(tjeneste=>tjeneste.navn),
                medarbeider: env.frisorer[env.frisorer.indexOf(frisor)].navn,
                telefonnummer: parseInt(telefonnummer),
                kunde:navn
            }} />:"")}

        </div>

        {(!isMobile?(<div className='infoboks'>
            <div>
            <h3>Din timebestilling</h3>
            <div>Dato {(dato != null?(<p>{parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</p>):"")}</div>
            <div>Frisør {(frisor != null?(<p>{frisor.navn}</p>):"")}</div>
            <div>Time for {(produkt.length > 0?(<p>{produkt.map(produkt=>produkt.navn).join(", ")}</p>):"")}</div>
            <div>Tid {(klokkeslettet != null && produkt.length > 0?(<p>{klokkeslettet}</p>):"")}</div>
            <div>Estimert pris {totalPris} kr</div>
            <div>Estimert tid {totalTid} minutter</div>
            </div>
            <p>obs.: Prisene er kun estimert og kan øke dersom det blir brukt hårprodukter eller om det kreves vask osv.</p>
        </div>):"")}

    
    
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


export default React.memo(Timebestilling);
