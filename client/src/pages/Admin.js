import React, {useEffect, useState} from 'react'
import RedigerKontakt from '../components/RedigerKontakt';
import RedigerPassord from '../components/RedigerPassord';
import LeggTilFrisor from '../components/LeggTilFrisor';
import DetaljerFrisor from '../components/DetaljerFrisor';
import Fri from '../components/Fri';
import RedigerAapningstider from '../components/RedigerAapningstider';

function Admin({env, bestilteTimer, sUpdateTrigger, updateTrigger, varsle}){
    const [frisorer, sFrisorer] = useState(env.frisorer); //[{navn:String, produkter:[Number]}]   [OK]
    const [tjenester, sTjenester] = useState(env.tjenester); //[{navn:String, kategori: Number, pris: Number, tid: Number}] []

    const [sosialeMedier, sSosialeMedier] = useState(env.sosialeMedier); //[{bruker:String, platform:String}] []

    const [kategorier, sKategorier] = useState(env.kategorier); //[String] []

    const [kontakt_epost, sKontakt_epost] = useState(env.kontakt_epost); //String
    const [kontakt_tlf, sKontakt_tlf] = useState(env.kontakt_tlf); //Number

    const [visRedigerAapningstider, sVisRedigerAapningstider] = useState(false);
    const [dagForRedigering, sDagForRedigering] = useState();
    
    //Frisører
    const [visRedigerFrisor, sVisRedigerFrisor] = useState(false);        
    const [visSiOpp, sVisSiOpp] = useState(false);        
    const [frisorRediger, sFrisorRediger] = useState(null);
    const [oppsigelsesDato, sOppsigelsesDato] = useState(new Date());



    
    //Synlige sider
    const [synligKomponent, setSynligKomponent] = useState(1);

    useEffect(()=>{
        sFrisorer(env.frisorer);
        sTjenester(env.tjenester);
        sSosialeMedier(env.sosialeMedier);
        sKategorier(env.kategorier);
        sKontakt_epost(env.kontakt_epost);
        sKontakt_tlf(env.kontakt_tlf);
    }, [env])

    async function siOppFrisor(){
        let tempFrisorer = env.frisorer;
        tempFrisorer.find((f)=>{return f.navn === frisorRediger.navn}).oppsigelse = oppsigelsesDato;

        sendTilDatabase(tempFrisorer, env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
        
    }

    //async function slettFrisor(frisor){
//
    //    //Oppdaterer env i databasen
    //    const nyFrisorer = frisorer.filter((f)=>{
    //        return f.navn !== frisor;
    //    })
    //    sFrisorer(nyFrisorer);
//
    //    //Fjerner brukeren til frisøren
    //    try {
    //        
    //        const data = {
    //            slettBrukernavn: frisor.toLowerCase()
    //        }
    //        const options = {
    //            method:"POST",
    //            headers:{
    //                "Content-Type":"application/json"
    //            },
    //            body: JSON.stringify(data)
    //        }
    //        const request = await fetch("http://localhost:3001/login/slettBruker", options);
    //        const response = request.json();
//
    //        const optionsEnv = {
    //            method:"POST",
    //            headers:{
    //                "Content-Type":"application/json"
    //            },
    //            body: JSON.stringify({navn:frisor})
    //        }
    //        const requestEnv = await fetch("http://localhost:3001/env/slettFrisor", optionsEnv);
    //        const responseEnv = await requestEnv.json();
//
//
    //        if(response && responseEnv){
    //            console.log(response);
    //            varsle();
    //        } 
    //        
    //    } catch (error) {
    //        console.log(error);
    //    }
    //}

    async function sendTilDatabase(fris, kat, tje, klok, some, epost, tlf){
        console.log("sendte nytt env til database");
        //fetch
        const nyttEnv = {
            frisorer:fris,
            kategorier:kat,
            tjenester:tje,
            klokkeslett:klok,
            sosialeMedier:some,
            kontakt_epost:epost,
            kontakt_tlf:tlf
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
            sUpdateTrigger(!updateTrigger);
            varsle();
        }
    }

    async function redigerPassordDB(nyttPass){
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({admin_pass:nyttPass})
        }
        const request = await fetch("http://localhost:3001/env/oppdaterAdminPass", options);
        const response = await request.json();
        if(response){
            console.log(response);
            varsle();
        }
    }

    async function oppdaterTimebestillinger(){
        console.log("sendte oppdaterte timereservasjoner til databasen");
    }

    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
                {env !== null? <div style={{display:"flex", flexDirection:"row"}}>
                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 1? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(1);
                    }}>TIMEBESTILLINGER</button>

                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 2? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(2);
                    }}>FRIDAGER OG FRAVÆR</button>

                    <button style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 3? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(3);
                    }}>KONTAKT-INFO, PASSORD, FRISØRER etc.</button>

                    </div>:""}

                
                <Fri env={env} bestilteTimer={bestilteTimer} synligKomponent={synligKomponent} varsle={varsle} />

                {synligKomponent === 1 && bestilteTimer !== null?(<>
                <h3>Timebestillinger</h3>
                    <div>
                        {bestilteTimer.map((time, index)=>(
                            <div key={index}>
                                <div>{time.medarbeider}: {time.dato} {time.tidspunkt}</div>
                            </div>
                        ))}
                    </div>
                    </>
                        
                ):""}


                {synligKomponent === 3 && env !== null?(
                    <>
                    
                    <h3>Frisører, behandlinger, kategorier, åpningstider, kontakt-info og passord</h3>
                    
                <div className='adminMain'>
                    <div>
                        <div className='redigeringsBoks'> <p>Kontakt telefon: {kontakt_tlf}</p> <RedigerKontakt number={true} state={kontakt_tlf} setState={sKontakt_tlf} env={env} sendTilDatabase={sendTilDatabase} /></div>
                        <div className='redigeringsBoks'> <p>Kontakt e-post: {kontakt_epost}</p> <RedigerKontakt number={false} state={kontakt_epost} setState={sKontakt_epost} env={env} sendTilDatabase={sendTilDatabase} /></div>
                    </div>

                    <div>
                        <div className='redigeringsBoks'><p>Passord for: admin</p> <RedigerPassord redigerPassordDB={redigerPassordDB} /> </div>
                    </div>
                    <div>
                        {visRedigerFrisor?<>
                            <button onClick={(e)=>{
                                e.preventDefault();
                                sVisRedigerFrisor(false);
                                sFrisorRediger(null);
                            }}>Lukk</button>
                            <div>
                                
                            {frisorRediger.navn}

                                <button onClick={(e)=>{
                                            e.preventDefault();
                                            //slettFrisor(frisor.navn);
                                            sVisSiOpp(true);
                                            if(frisorRediger.oppsigelse !== "Ikke oppsagt"){
                                                sOppsigelsesDato(frisorRediger.oppsigelse);
                                            }
                                }}>{frisorRediger.oppsigelse == "Ikke oppsagt"?"Si opp (legg inn oppsigelsesdato)":"Rediger oppsigelse"}</button>
                                 

                            </div>   

                            {visSiOpp?<>
                            
                                <h4>Legg inn oppsigelsesdato for {frisorRediger.navn}</h4>
                                <p>Legg inn datoen som frisøren ikke lenger jobber. Frisøren vil kunne få reservasjoner før denne datoen men 
                                    ikke på denne datoen eller etter. Dette er for å unngå at frisøren får reservasjoner som ikke kan gjennomføres.
                                </p>
                                <input type="date" value={oppsigelsesDato} onChange={(e)=>{
                                    e.preventDefault();
                                    sOppsigelsesDato(e.target.value);
                                }} />
                                <div>
                                <button onClick={(e)=>{
                                    e.preventDefault();
                                    sVisSiOpp(false);
                                    sFrisorRediger(null);
                                }} >Avbryt</button>
                                <button onClick={(e)=>{
                                    e.preventDefault();
                                    sVisSiOpp(false);
                                    siOppFrisor();
                                }}>Lagre dato for oppsigelse</button>
                                </div>
                            </>:""}

                        </>:<>
                            {frisorer.map((frisor)=>(
                                <div key={frisor.navn} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>

                                    <DetaljerFrisor frisor={frisor} env={env} />

                                    <button onClick={(e)=>{
                                        e.preventDefault();
                                        sFrisorRediger(frisor);
                                        sVisRedigerFrisor(true);
                                    }} >Rediger</button>


                                </div>
                            ))}
                        </>}

                        {env !== null?<LeggTilFrisor env={env} varsle={varsle} updateTrigger={updateTrigger} sUpdateTrigger={sUpdateTrigger} />:""}
                        
                    </div>
                    <div>
                        {visRedigerAapningstider?<>
                            <RedigerAapningstider env={env} sendTilDatabase={sendTilDatabase} dag={dagForRedigering} sVisRedigerAapningstider={sVisRedigerAapningstider}/>
                        </> :env.klokkeslett.map((klokkeslett, index)=>(
                            <div key={index} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                             {klokkeslett.dag} {klokkeslett.open} - {klokkeslett.closed}
                             <button onClick={()=>{
                                console.log("trykket på rediger-knapp for åpningstider");
                                sDagForRedigering(klokkeslett);
                                sVisRedigerAapningstider(true);
                             }}><img alt='rediger' src="rediger.png" style={{height:"1.4rem"}}></img></button>
                            </div>
                        ))}
                    </div>
                </div></>
                ):""}
        </div>
    )
}

export default React.memo(Admin);