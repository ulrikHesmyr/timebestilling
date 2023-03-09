import React, {useEffect, useState} from 'react'
import Tjenester from '../components/Tjenester';
import Klokkeslett from '../components/Klokkeslett';
import Frisor from '../components/Frisor';
import PersonInfo from '../components/PersonInfo';
import Dato from '../components/Dato';
import { hentDato } from '../App';

function Timebestilling({env, hentMaaned, setReservasjon}){
    
    const [isMobile, setIsMobile] = useState(false);
    const [updateDataTrigger, setUpdate] = useState(false);
    const [bestilteTimer, setBestiltetimer] = useState(undefined);
    const [friElementer, sFriElementer] = useState(undefined);

    const [frisorBildeArray, sFrisorBildeArray] = useState(null);

    const [tilgjengeligeFrisorer, sTilgjengeligeFrisorer] = useState([]);

    
    const [dato, sDato] = useState(hentDato());
    const [produkt, sProdukt] = useState([]);
    const [frisor, sFrisor] = useState(null);
    const [klokkeslettet, sKlokkeslett] = useState(null);
    const [navn, sNavn] = useState('');
    const [telefonnummer, sTelefonnummer] = useState('');
    const [synligKomponent, setSynligKomponent] = useState(0);

    const [forsteFrisor, sForsteFrisor] = useState(false);

    //Viser antall valgte behandlinger i hver kategori
    const [antallBehandlinger, sAntallBehandlinger] = useState(env.kategorier.map(k=>k = 0));

    function nullstillData(){
        sDato(hentDato());
        sProdukt([]);
        sFrisor(null);
        sKlokkeslett(null);
        sNavn('');
        sTelefonnummer('');
        sForsteFrisor(false);
    }

    function displayKomponent(componentIndex){
        setSynligKomponent(componentIndex);
    }

    
    function includesArray(source, target) {
        return target.every(function(elem) {
            return source.includes(elem);
        });
    }

    async function fetchBestilteTimer(){
        const request = await fetch('http://localhost:1226/timebestilling/hentBestiltetimer');
        const response = await request.json();
        
          if(response){
              setBestiltetimer(response);
          }
    }
      
    async function hentFri(){
        const request = await fetch("http://localhost:1226/env/fri");
        const response = await request.json();
        if(response){
            sFriElementer(response);
        }
    }
    
  useEffect(()=>{
    const userAgent = window.navigator.userAgent;
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    fetchBestilteTimer();
    hentFri();
  }, [])

  
    useEffect(()=>{
        let behandlinger = produkt.map(tjeneste=>tjeneste.navn);
        let tilgjengeligeFrisorer = env.frisorer.filter(frisor=>includesArray(frisor.produkter, behandlinger));
        sTilgjengeligeFrisorer(tilgjengeligeFrisorer);
    },[env.tjenester, produkt, env.frisorer]);

    const gjeldendeTjenester = env.tjenester.filter(element=>produkt.includes(element));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);

    return (

    <div className='timebestilling'>
        <div className='container'>
            <div style={{display:"flex", flexDirection:"row"}}>
                <img src="logo.png" alt='Logo' style={{height:"5rem"}}></img>
                <h1>Timereservasjon {env.bedrift}</h1>
            </div>
            <p>Her kan du reservere time hos oss! </p>
            
            <h2 role="button" aria-label='Vis: "Velg behandling"-boks ' aria-expanded={synligKomponent === 0} aria-controls="tje" id="visTjeneseterAria" className='overskrift' onClick={()=>{
                if(synligKomponent === 0){
                    displayKomponent(-1);
                } else {
                    displayKomponent(0);
                }
            }} style={{backgroundColor: produkt.length > 0?"var(--farge3)":"white"}}><p>1</p>Behandlinger</h2>
            {(synligKomponent === 0 && env !== null?<div role="region" aria-labelledby='visTjeneseterAria' id="tje" aria-hidden={!(synligKomponent === 0)} > <Tjenester sFrisor={sFrisor} antallBehandlinger={antallBehandlinger} sAntallBehandlinger={sAntallBehandlinger} sKlokkeslett={sKlokkeslett} env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} produkt={produkt} sProdukt={sProdukt} frisor={frisor} /></div>:"")}
           
           
            <h2 role="button" aria-label='Vis: "Velg frisør"-boks ' aria-expanded={synligKomponent === 1 && produkt.length > 0} aria-controls="fri" id="visFrisorAria" className='overskrift' onClick={()=>{
                if(synligKomponent === 1){
                    displayKomponent(-1);
                } else {
                    displayKomponent(1);
                }
            }} style={{backgroundColor: frisor !== null?"var(--farge3)":"white"}}><p>2</p>Velg frisør</h2>
            {(synligKomponent === 1 && produkt.length > 0? <div role="region" aria-labelledby='visFrisorAria' id="fri" aria-hidden={!(synligKomponent === 1 && produkt.length > 0)}> <Frisor sFrisorBildeArray={sFrisorBildeArray} frisorBildeArray={frisorBildeArray} tilgjengeligeFrisorer={tilgjengeligeFrisorer} sTilgjengeligeFrisorer={sTilgjengeligeFrisorer} env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor} sProdukt={sProdukt}/> </div>:"")}
           
            <h2 role="button" aria-label='Vis: "valg av klokkeslett og dato"-boks ' aria-expanded={synligKomponent === 2 && frisor !== null } aria-controls="dat" id="visDatoOgKlokkeslettAria" className='overskrift' onClick={()=>{
                if(synligKomponent === 2){
                    displayKomponent(-1);
                } else {
                    displayKomponent(2);
                }
            }} style={{backgroundColor: dato !== null && klokkeslettet !== null ?"var(--farge3)":"white"}} ><p>3</p> Velg dato og tid</h2>
            <div  role="region" aria-labelledby='visDatoOgKlokkeslettAria' id="dat" aria-hidden={!(synligKomponent === 2 && frisor !== null )}>
                {(synligKomponent === 2 && frisor !== null ? <Dato dato={dato} synligKomponent={synligKomponent} displayKomponent={displayKomponent} sDato={sDato} sKlokkeslett={sKlokkeslett} sProdukt={sProdukt} klokkeslettet={klokkeslettet} produkt={produkt} />:"")}
                {(synligKomponent === 2 && frisor !== null && bestilteTimer !== null? <Klokkeslett friElementer={friElementer} sForsteFrisor={sForsteFrisor} tilgjengeligeFrisorer={tilgjengeligeFrisorer} sTilgjengeligeFrisorer={sTilgjengeligeFrisorer} env={env}  displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
            </div>

            <h2 role="button" aria-label='Vis: "sjekk ut"-boks ' aria-expanded={synligKomponent === 3 && klokkeslettet !== null} aria-controls="per" id="visPersonInfoAria" className='overskrift' onClick={()=>{
                if(synligKomponent === 3){
                    displayKomponent(-1);
                } else {
                    displayKomponent(3);
                }
            }} style={{backgroundColor: navn !== "" && telefonnummer.toString().length === 8?"var(--farge3)":"white"}}><p>4</p>Din info</h2>
            <div role="region" aria-labelledby='visPersonInfoAria' id="per" aria-hidden={!(synligKomponent === 3 && klokkeslettet !== null)}>
                {(synligKomponent === 3 && klokkeslettet !== null?<PersonInfo totalPris={totalPris} totalTid={totalTid} klokkeslettet={klokkeslettet} produkt={produkt} frisor={frisor} hentMaaned={hentMaaned} dato={dato} isMobile={isMobile} synligKomponent={synligKomponent} displayKomponent={displayKomponent} telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
                    dato:dato, 
                    tidspunkt:klokkeslettet,
                    //frisor: (frisor === false?env.frisorer.indexOf(forsteFrisor):env.frisorer.indexOf(frisor)),
                    behandlinger:produkt.map(tjeneste=>tjeneste.navn),
                    telefonnummer: parseInt(telefonnummer),
                    kunde:navn,
                    medarbeider:(frisor === false? forsteFrisor.navn:frisor.navn)
                }} />:"")}
            </div>

        </div>

        {(!isMobile?(<div className='infoboks'>
            <div>
            <h3>Din timebestilling</h3>
            <div>Dato {(dato != null?(<p>{parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</p>):"")}</div>
            <div>Frisør {(frisor === false?(<p>Første ledige frisør</p>):(frisor != null?(<p>{frisor.navn}</p>):""))}</div>
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
