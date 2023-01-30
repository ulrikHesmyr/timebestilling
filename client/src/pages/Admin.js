import React, {useEffect, useState} from 'react'
import RedigerKontakt from '../components/RedigerKontakt';
import RedigerPassord from '../components/RedigerPassord';
import LeggTilFrisor from '../components/LeggTilFrisor';
import DetaljerFrisor from '../components/DetaljerFrisor';
import Fri from '../components/Fri';

function Admin({env, bestilteTimer}){
    console.log(env);
    console.log(bestilteTimer);
    
    //const [admin_bruker, sABruker] = useState(env.admin_bruker);
    //const [vakter_bruker, sVBruker] = useState(env.bruker_pass);

    const [admin_pass, sAPassord] = useState(env.admin_pass); //String [OK]
    const [vakter_pass, sVPassord] = useState(env.vakter_pass); //String [OK]

    const [frisorer, sFrisorer] = useState(env.frisorer); //[{navn:String, produkter:[Number]}]   [OK]
    const [klokkeslett, sKlokkeslett] = useState(env.klokkeslett); //[{dag:String, open:String, closed:String}] []
    const [tjenester, sTjenester] = useState(env.tjenester); //[{navn:String, kategori: Number, pris: Number, tid: Number}] []

    const [sosialeMedier, sSosialeMedier] = useState(env.sosialeMedier); //[{bruker:String, platform:String}] []

    const [kategorier, sKategorier] = useState(env.kategorier); //[String] []

    const [kontakt_epost, sKontakt_epost] = useState(env.kontakt_epost); //String
    const [kontakt_tlf, sKontakt_tlf] = useState(env.kontakt_tlf); //Number

    //const [tempBestilteTimer, setTempBestilteTimer] = useState();

    //Synlige sider
    const [synligKomponent, setSynligKomponent] = useState(0);


    useEffect(()=>{
        setTempBestilteTimer(bestilteTimer)
    }, [bestilteTimer]);

    useEffect(()=>{
        if(frisorer !== env.frisorer || admin_pass !== env.admin_pass || vakter_pass !== env.vakter_pass
            || klokkeslett !== env.klokkeslett || tjenester !== env.tjenester || sosialeMedier !== env.sosialeMedier
            || kategorier !== env.kategorier || kontakt_epost !== env.kontakt_epost || kontakt_tlf !== env.kontakt_tlf){
            sendTilDatabase();
        }
    },[]);//Kan oppstå bugs, fjernet dependencies env, admin_pass, vakter_pass, frisorer, klokkeslett, tjenester, sosialeMedier, kategorier, kontakt_epost, kontakt_tlf

    async function sendTilDatabase(){
        console.log("sendte nytt env til database");
        //fetch
        const nyttEnv = {
            admin_pass:admin_pass,
            vakter_pass:vakter_pass,
            frisorer:frisorer,
            kategorier:kategorier,
            tjenester:tjenester,
            klokkeslett:klokkeslett,
            sosialeMedier:sosialeMedier,
            kontakt_epost:kontakt_epost,
            kontakt_tlf:kontakt_tlf
        }
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(nyttEnv)
        }
        const request = await fetch("http://localhost:3001/env/oppdaterEnv", options);
        const response = await request.json();
        if(response){
            console.log(response);
        }
    }

    async function oppdaterTimebestillinger(){
        console.log("sendte oppdaterte timereservasjoner til databasen");
    }

    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
                {env !== null? <div style={{display:"flex", flexDirection:"row"}}>
                
                    <button style={{margin:"0", boxShadow:(synligKomponent === 1?"0px 2px 0px black":"0px 0px 0px white")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(1);
                    }}>TIMEBESTILLINGER</button>

                
                    <button style={{margin:"0", boxShadow:(synligKomponent === 2?"0px 2px 0px black":"0px 0px 0px white")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(2);
                    }}>FRIDAGER OG FRAVÆR</button>

                    <button style={{margin:"0", boxShadow:(synligKomponent === 3?"0px 2px 0px black":"0px 0px 0px white")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(3);
                    }}>KONTAKT-INFO, PASSORD, FRISØRER etc.</button>

                    </div>:""}

                
                <Fri env={env} bestilteTimer={bestilteTimer} synligKomponent={synligKomponent} />

                {synligKomponent === 1 && bestilteTimer !== null?(<>
                <h3>Timebestillinger</h3>
                    <div>
                        {bestilteTimer.map(time=>(
                            <div>
                                <div>{time.medarbeider}: {time.dato} {time.tidspunkt}</div>
                            </div>
                        ))}
                    </div>
                    </>
                        
                ):""}


                {synligKomponent === 3 && env !== null?(
                <div>
                    <h3>Frisører, behandlinger, kategorier, åpningstider, kontakt-info og passord</h3>
                    <div>
                        <div className='redigeringsBoks'> <p>Kontakt telefon: {kontakt_tlf}</p> <RedigerKontakt number={true} state={kontakt_tlf} setState={sKontakt_tlf} sendTilDatabase={sendTilDatabase} /></div>
                        <div className='redigeringsBoks'> <p>Kontakt e-post: {kontakt_epost}</p> <RedigerKontakt number={false} state={kontakt_epost} setState={sKontakt_epost} sendTilDatabase={sendTilDatabase} /></div>
                    </div>

                    <div>
                        <div className='redigeringsBoks'><p>Passord for: vakter</p> <RedigerPassord state={vakter_pass} setState={sVPassord} sendTilDatabase={sendTilDatabase} /> </div>
                        <div className='redigeringsBoks'><p>Passord for: admin</p> <RedigerPassord state={admin_pass} setState={sAPassord} sendTilDatabase={sendTilDatabase} /> </div>
                    </div>
                    <div>
                        {frisorer.map((frisor)=>(
                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                                <DetaljerFrisor frisor={frisor} env={env} />
                            </div>
                        ))}
                        {env !== null?<LeggTilFrisor env={env} setState={sFrisorer} state={frisorer}/>:""}
                        
                    </div>
                </div>
                ):""}
        </div>
    )
}

export default React.memo(Admin);