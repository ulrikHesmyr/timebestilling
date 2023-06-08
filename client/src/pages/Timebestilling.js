import React, {useEffect, useState, useRef} from 'react'
import Tjenester from '../components/Tjenester';
import Klokkeslett from '../components/Klokkeslett';
import Frisor from '../components/Frisor';
import PersonInfo from '../components/PersonInfo';
import Dato from '../components/Dato';
import { hentDato } from '../App';
import Footer from '../components/Footer';

function Timebestilling({env, hentMaaned, setReservasjon}){
    
    const behandlingerBoks = useRef(null);
    const frisorBoks = useRef(null);
    const klokkeslettBoks = useRef(null);
    const personInfoBoks = useRef(null);

    const [isMobile, setIsMobile] = useState(false);
    const [updateDataTrigger, setUpdate] = useState(false);
    const [bestilteTimer, setBestiltetimer] = useState(undefined);
    const [friElementer, sFriElementer] = useState(undefined);

    const [frisorBildeArray, sFrisorBildeArray] = useState(null);

    const [tilgjengeligeFrisorer, sTilgjengeligeFrisorer] = useState([]);

    
    const [dato, sDato] = useState(hentDato());
    const [midlertidigDato, sMidlertidigDato] = useState(hentDato());
    const [produkt, sProdukt] = useState([]);
    const [frisor, sFrisor] = useState(null);
    const [klokkeslettet, sKlokkeslett] = useState(null);
    const [navn, sNavn] = useState('');
    const [telefonnummer, sTelefonnummer] = useState('');
    const [synligKomponent, setSynligKomponent] = useState(0);
    const [smsBekreftelse, sSmsBekreftelse] = useState(false);
    const [harEndretDatoen, sHarEndretDatoen] = useState(false);

    const [forsteFrisor, sForsteFrisor] = useState(false);
    
    const [datoForsteLedige, sDatoForsteLedige] = useState(null);

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
        sDatoForsteLedige(null);
        sMidlertidigDato(hentDato());
    }

    function displayKomponent(componentIndex){
        setSynligKomponent(componentIndex);
        switch(componentIndex){
            case 0:
                behandlingerBoks.current.scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case 1:
                frisorBoks.current.scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case 2:
                klokkeslettBoks.current.scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case 3:
                personInfoBoks.current.scrollIntoView({behavior: "smooth", block: "center"});
                break;
            default:
                break;

        }

    }

    
    function includesArray(source, target) {
        return target.every(function(elem) {
            return source.includes(elem);
        });
    }

    async function fetchBestilteTimer(){
        const request = await fetch("http://localhost:1227/timebestilling/hentBestiltetimer");
        const response = await request.json();
        
          if(response){
              setBestiltetimer(response);
          }
    }
      
    async function hentFri(){
        const request = await fetch("http://localhost:1227/env/fri");
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
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"flex-start", backdropFilter:"blur(5px)"}}>
                <img src="logo.png" alt='Logo' style={{height:"5rem"}}></img>
                <div>
                    <h1 className='bedriftNavn'>{env.bedrift}</h1>
                    <p>Her kan du reservere time hos oss! </p>
                </div>
                <div ref={behandlingerBoks}></div>
            </div>
            <div className='overskriftene'>
                
            <h2 tabIndex={0} role="button" aria-label='Vis: "Velg behandling"-boks ' 
            aria-expanded={synligKomponent === 0} 
            aria-controls="tje" id="visTjeneseterAria" 
            className={produkt.length > 0? `gjennomfortOverskrift ${(synligKomponent === 0?"aktivOverskrift overskrift":'overskrift')}`:(synligKomponent === 0?"aktivOverskrift overskrift":'overskrift')} onClick={()=>{
                displayKomponent(0);
            }} onKeyDown={(e)=>{
                if(e.code === "Enter" || e.code === "Space"){
                    displayKomponent(0);
                }
            }} >
                <p>1</p>Behandlinger</h2>

            <h2 tabIndex={0} role="button" 
            aria-label='Vis: Velg medarbeider-boks' 
            aria-expanded={synligKomponent === 1 && produkt.length > 0} 
            aria-controls="fri" id="visFrisorAria" 
            className={frisor !== null? `gjennomfortOverskrift ${(synligKomponent === 1?"aktivOverskrift overskrift":'overskrift')}`:(synligKomponent === 1?"aktivOverskrift overskrift":'overskrift')} onClick={()=>{
                if(produkt.length > 0){
                    displayKomponent(1);
                } else {
                    alert("Du må velge behandling");
                }
            }} onKeyDown={(e)=>{
                if(e.code === "Enter" || e.code === "Space"){
                    if(produkt.length > 0){
                        displayKomponent(1);
                    } else {
                        alert("Du må velge behandling");
                    }
                }
            }} >
                <p>2</p>Velg medarbeider</h2>

            <h2 tabIndex={0} role="button" 
            aria-label='Vis valg av klokkeslett og dato' 
            aria-expanded={synligKomponent === 2 && frisor !== null } 
            aria-controls="dat" id="visDatoOgKlokkeslettAria" 
            className={klokkeslettet !== null? `gjennomfortOverskrift ${(synligKomponent === 2?"aktivOverskrift overskrift":'overskrift')}`:(synligKomponent === 2?"aktivOverskrift overskrift":'overskrift')} onClick={()=>{
                if(frisor !== null && produkt.length > 0){
                    displayKomponent(2);
                } else {
                    alert("Du må velge behandling og medarbeider først");
                }
            }} onKeyDown={(e)=>{
                if(e.code === "Enter" || e.code === "Space"){
                    if(frisor !== null && produkt.length > 0){
                        displayKomponent(2);
                    } else {
                        alert("Du må velge behandling og medarbeider først");
                    }
                }
            }} >
                <p>3</p> Velg dato og tid</h2>

            <h2 tabIndex={0} role="button" 
            aria-label='Vis din info boks' 
            aria-expanded={synligKomponent === 3 && klokkeslettet !== null} 
            aria-controls="per" id="visPersonInfoAria" 
            className={telefonnummer.length === 8 && navn !== ""? `gjennomfortOverskrift ${(synligKomponent === 3?"aktivOverskrift overskrift":'overskrift')}`:(synligKomponent === 3?"aktivOverskrift overskrift":'overskrift')} onClick={()=>{
                if(frisor !== null && produkt.length > 0 && klokkeslettet !== null){
                    displayKomponent(3);
                } else {
                    alert("Du må velge behandling, medarbeider, dato og klokkeslett først");
                }
            }} onKeyDown={(e)=>{
                if(e.code === "Enter" || e.code === "Space"){
                    if(frisor !== null && produkt.length > 0 && klokkeslettet !== null){
                        displayKomponent(3);
                    } else {
                        alert("Du må velge behandling, medarbeider, dato og klokkeslett først");
                    }
                }
            }} >
                <p>4</p>Din info</h2>

            </div>
            <div ref={frisorBoks} ></div>
            {(synligKomponent === 0 && env !== null?<div role="region" aria-labelledby='visTjeneseterAria' id="tje" aria-hidden={!(synligKomponent === 0)} > <Tjenester sDatoForsteLedige={sDatoForsteLedige} sFrisor={sFrisor} antallBehandlinger={antallBehandlinger} sAntallBehandlinger={sAntallBehandlinger} sKlokkeslett={sKlokkeslett} env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} produkt={produkt} sProdukt={sProdukt} frisor={frisor} /></div>:"")}
           
            
            {(synligKomponent === 1 && produkt.length > 0? <div role="region" aria-labelledby='visFrisorAria' id="fri" aria-hidden={!(synligKomponent === 1 && produkt.length > 0)}> <Frisor sDatoForsteLedige={sDatoForsteLedige} sMidlertidigDato={sMidlertidigDato} sDato={sDato} sFrisorBildeArray={sFrisorBildeArray} frisorBildeArray={frisorBildeArray} tilgjengeligeFrisorer={tilgjengeligeFrisorer} sTilgjengeligeFrisorer={sTilgjengeligeFrisorer} env={env} synligKomponent={synligKomponent} displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} sKlokkeslett={sKlokkeslett} frisor={frisor} sFrisor={sFrisor}  sProdukt={sProdukt}/> </div>:"")}
            <div ref={klokkeslettBoks}></div>

            
            <div  role="region" aria-labelledby='visDatoOgKlokkeslettAria' id="dat" aria-hidden={!(synligKomponent === 2 && frisor !== null )}>
                {(synligKomponent === 2 && frisor !== null ? <Dato datoForsteLedige={datoForsteLedige} harEndretDatoen={harEndretDatoen} sHarEndretDatoen={sHarEndretDatoen} hentMaaned={hentMaaned} dato={dato} synligKomponent={synligKomponent} displayKomponent={displayKomponent} sDato={sDato} sMidlertidigDato={sMidlertidigDato} midlertidigDato={midlertidigDato} sKlokkeslett={sKlokkeslett} sProdukt={sProdukt} klokkeslettet={klokkeslettet} produkt={produkt} />:"")}
            <div  ref={personInfoBoks} ></div>
                {(synligKomponent === 2 && frisor !== null && bestilteTimer !== null? <Klokkeslett harEndretDatoen={harEndretDatoen} datoForsteLedige={datoForsteLedige} sDatoForsteLedige={sDatoForsteLedige} sDato={sDato} sMidlertidigDato={sMidlertidigDato} midlertidigDato={midlertidigDato} friElementer={friElementer} sForsteFrisor={sForsteFrisor} tilgjengeligeFrisorer={tilgjengeligeFrisorer} sTilgjengeligeFrisorer={sTilgjengeligeFrisorer} env={env}  displayKomponent={displayKomponent} klokkeslettet={klokkeslettet} produkt={produkt} bestilteTimer={bestilteTimer} frisor={frisor} sKlokkeslett={sKlokkeslett} dato={dato} hentMaaned={hentMaaned}/>:"")}
            </div>

            
            <div role="region" aria-labelledby='visPersonInfoAria' id="per" aria-hidden={!(synligKomponent === 3 && klokkeslettet !== null)}>
                {(synligKomponent === 3 && klokkeslettet !== null?<PersonInfo smsBekreftelse={smsBekreftelse} sSmsBekreftelse={sSmsBekreftelse} env={env} totalPris={totalPris} totalTid={totalTid} klokkeslettet={klokkeslettet} produkt={produkt} frisor={frisor} hentMaaned={hentMaaned} dato={dato} isMobile={isMobile} synligKomponent={synligKomponent} displayKomponent={displayKomponent} telefonnummer={telefonnummer} navn={navn} nullstillData={nullstillData} setReservasjon={setReservasjon} setUpdate={setUpdate} updateDataTrigger={updateDataTrigger} sNavn={sNavn} sTelefonnummer={sTelefonnummer} data={{
                    dato:dato, 
                    tidspunkt:klokkeslettet,
                    //frisor: (frisor === false?env.frisorer.indexOf(forsteFrisor):env.frisorer.indexOf(frisor)),
                    behandlinger:produkt.map(tjeneste=>tjeneste.navn),
                    telefonnummer: telefonnummer,
                    kunde:navn,
                    medarbeider:(frisor === false? forsteFrisor.navn:frisor.navn),
                    SMS_ENABLED: smsBekreftelse,
                }} />:"")}
            </div>

        </div>

        {(!isMobile?(<div className='infoboks'>
            <div>
            <h3>Din timebestilling</h3>
            <div>Dato {(dato != null?(<p>{parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</p>):"")}</div>
            <div>Medarbeider {(frisor === false?(<p>Første ledige medarbeider</p>):(frisor != null?(<p>{frisor.navn}</p>):""))}</div>
            <div>Time for {(produkt.length > 0?(<p>{produkt.map(produkt=>produkt.navn).join(", ")}</p>):"")}</div>
            <div>Klokkeslett {(klokkeslettet != null && produkt.length > 0?(<p>{klokkeslettet}</p>):"")}</div>
            <div>Estimert pris {totalPris} kr</div>
            <div>Estimert tid {totalTid} minutter</div>
            </div>
            <p>obs.: Prisene er kun estimert og kan øke dersom det blir brukt hårprodukter eller om det kreves vask osv.</p>
        </div>):"")}

    {isMobile?"":<Footer env={env}/>}
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
