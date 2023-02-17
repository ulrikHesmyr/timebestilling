import React, {useEffect, useState} from 'react'
import RedigerKontakt from '../components/RedigerKontakt';
import RedigerPassord from '../components/RedigerPassord';
import LeggTilFrisor from '../components/LeggTilFrisor';
import DetaljerFrisor from '../components/DetaljerFrisor';
import Fri from '../components/Fri';
import RedigerAapningstider from '../components/RedigerAapningstider';

function Admin({env, bestilteTimer, sUpdateTrigger, updateTrigger, varsle}){
    
    const behandlingsEstimater = [15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240];
    const [kontakt_epost, sKontakt_epost] = useState(env.kontakt_epost);
    const [kontakt_tlf, sKontakt_tlf] = useState(env.kontakt_tlf);

    const [visRedigerAapningstider, sVisRedigerAapningstider] = useState(false);
    const [dagForRedigering, sDagForRedigering] = useState();
    
    //Behandling for redigering

    //Opprett ny behandling (vis/skjul) og opprett behandling
    const [visOpprettBehandling, sVisOpprettBehandling] = useState(null);
    const [nyBehandlingNavn, sNyBehandlingNavn] = useState("");
    const [nyBehandlingPris, sNyBehandlingPris] = useState(0);
    const [nyBehandlingBeskrivelse, sNyBehandlingBeskrivelse] = useState("");
    const [nyBehandlingKategori, sNyBehandlingKategori] = useState(env.kategorier[0]);
    const [nyBehandlingTid, sNyBehandlingTid] = useState(behandlingsEstimater[0]);

    //Slett en behandling
    const [visSlettBehandling, sVisSlettBehandling] = useState(null);
    const [behandlingForSletting, sBehandlingForSletting] = useState(env.tjenester[0]);

    
    //Synlige sider
    const [synligKomponent, setSynligKomponent] = useState(1);

    useEffect(()=>{
        sKontakt_epost(env.kontakt_epost);
        sKontakt_tlf(env.kontakt_tlf);
    }, [env])

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

    //async function oppdaterTimebestillinger(){
    //    console.log("sendte oppdaterte timereservasjoner til databasen");
    //}

    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
                {env !== null? <div style={{display:"flex", flexDirection:"row"}}>
                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 1? "none":"2px solid black"), color:(synligKomponent=== 1? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(1);
                    }}>TIMEBESTILLINGER</button>

                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 2? "none":"2px solid black"), color:(synligKomponent=== 2? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(2);
                    }}>FRIDAGER OG FRAVÆR</button>

                    <button style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 3? "none":"2px solid black"), color:(synligKomponent=== 3? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(3);
                    }}>KONTAKT-INFO, PASSORD, FRISØRER etc.</button>
                    <button style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 4? "none":"2px solid black"), color:(synligKomponent=== 4? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(4);
                    }}>BEHANDLINGER</button>

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
                    
                    <h3>Frisører, kategorier, åpningstider, kontakt-info og passord</h3>
                    
                <div className='adminMain'>
                    <div>
                    <h4>Kontakt-info og administrator passord:</h4>
                        <div className='redigeringsBoks'> 
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <RedigerKontakt number={true} state={kontakt_tlf} setState={sKontakt_tlf} env={env} sendTilDatabase={sendTilDatabase} /><p>Kontakt telefon: </p> 
                            </div>
                            <p className='redigeringsElement'>{kontakt_tlf}</p>
                        </div>

                        <div className='redigeringsBoks'> 
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <RedigerKontakt number={false} state={kontakt_epost} setState={sKontakt_epost} env={env} sendTilDatabase={sendTilDatabase} /> <p>Kontakt e-post:</p>
                            </div>
                            <p className='redigeringsElement'>{kontakt_epost}</p>
                        </div>
                        <div className='redigeringsBoks'>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <RedigerPassord redigerPassordDB={redigerPassordDB} /> <p>Passord for: admin</p> 
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4>Frisører:</h4>
                        {env.frisorer.map((frisor)=>(
                                <div key={frisor.navn} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>

                                    <DetaljerFrisor frisor={frisor} env={env} sendTilDatabase={sendTilDatabase} varsle={varsle}/>

                                </div>
                            ))}

                        {env !== null?<LeggTilFrisor env={env} varsle={varsle} updateTrigger={updateTrigger} sUpdateTrigger={sUpdateTrigger} />:""}
                        
                    </div>
                    <div>
                    <h4>Åpningstider:</h4>
                        {visRedigerAapningstider?<>
                            <RedigerAapningstider env={env} sendTilDatabase={sendTilDatabase} dag={dagForRedigering} sVisRedigerAapningstider={sVisRedigerAapningstider}/>
                        </> :env.klokkeslett.map((klokkeslett, index)=>(
                            <div key={index} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                             {klokkeslett.dag}: {klokkeslett.stengt?"Stengt" :klokkeslett.open} {klokkeslett.stengt?"": "-"} {klokkeslett.stengt?"": klokkeslett.closed}
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


                {synligKomponent === 4 && env !== null?(
                <>
                    <div>
                    <h4>Behandlinger:</h4>
                    {visOpprettBehandling?

                        <div className='fokus'>

                            <div style={{display:"flex", flexDirection:"column", margin:"0.3rem"}}>
                                <label>Navn på ny behandling: 
                                    <input maxLength={30} type="text" placeholder="Navn" value={nyBehandlingNavn} onChange={(e)=>{
                                    sNyBehandlingNavn(e.target.value);
                                    }}></input>
                                </label>

                                <label>Beskrivelse for behandlingen: 
                                    <input maxLength={100} type="text" placeholder='Beskrivelse' onChange={(e)=>{
                                        sNyBehandlingBeskrivelse(e.target.value);
                                    }} value={nyBehandlingBeskrivelse}></input> 
                                </label>

                                <label>Pris for behandlingen:
                                    <input type="number" placeholder='Pris' onChange={(e)=>{
                                        sNyBehandlingPris(e.target.value);
                                    }} value={nyBehandlingPris}></input>
                                </label>

                                <label>Kategori for behandlingen: <select onChange={(e)=>{
                                        sNyBehandlingKategori(e.target.value);
                                    }} value={nyBehandlingKategori}>
                                        {env.kategorier.map((kategori)=>(
                                            <option key={kategori} value={kategori}>{kategori}</option>
                                        ))}
                                    </select>
                                </label>

                                <label>Estimert tid for behandlingen: <select onChange={(e)=>{
                                        sNyBehandlingTid(e.target.value);
                                    }} value={nyBehandlingTid}>
                                        {behandlingsEstimater.map((estimertTid)=>(
                                            <option key={estimertTid} value={estimertTid}>{estimertTid}</option>
                                        ))}
                                    </select> minutter</label>

                                <div>
                                    <button onClick={()=>{
                                        sVisOpprettBehandling(false);
                                        sNyBehandlingNavn("");
                                        sNyBehandlingBeskrivelse("");
                                        sNyBehandlingPris("");
                                        sNyBehandlingKategori(env.kategorier[0]);
                                        sNyBehandlingTid(behandlingsEstimater[0]);
                                    }}>Avbryt</button>

                                    <button onClick={()=>{
                                        console.log(nyBehandlingKategori);
                                        if(nyBehandlingNavn !== "" && nyBehandlingBeskrivelse !== "" && !isNaN(parseInt(nyBehandlingPris)) && nyBehandlingKategori !== "" && !isNaN(parseInt(nyBehandlingPris))){
                                            let tempBehandlinger = env.tjenester;
                                            tempBehandlinger.push({navn:nyBehandlingNavn, beskrivelse:nyBehandlingBeskrivelse, pris:parseInt(nyBehandlingPris), kategori:nyBehandlingKategori, tid:(parseInt(nyBehandlingTid))});
                                            sendTilDatabase(env.frisorer, env.kategorier, tempBehandlinger, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
                                            sVisOpprettBehandling(false);
                                            sNyBehandlingNavn("");
                                            sNyBehandlingBeskrivelse("");
                                            sNyBehandlingPris("");
                                            sNyBehandlingKategori(env.kategorier[0]);
                                            sNyBehandlingTid(behandlingsEstimater[0]);
                                        }else{
                                            alert("Alle felt må fylles ut på riktig format");
                                        }
                                    }}>Lagre</button>

                                </div>
                            </div>

                        </div>
                        
                        :
                        <>
                        <button style={{display:"flex", alignItems:"center"}} onClick={()=>{
                            sVisOpprettBehandling(true);
                        }} ><img alt='Legg til frisør' src="leggtil.png" ></img>Opprett ny behandling</button>
                        
                        
                        </>
                        }
                        

                        {visSlettBehandling?
                        <div className='fokus'>
                            <h4>Velg behandling som skal slettes:</h4>
                            <label>Behandling: <select onChange={(e)=>{
                                sBehandlingForSletting(e.target.value);
                            }}>
                        {env.tjenester.map((behandling)=>(
                            <option key={behandling.navn} value={behandling.navn}>{behandling.navn}</option>
                        ))}
                            </select></label>  

                            <div>
                                <button onClick={()=>{
                                    sVisSlettBehandling(false);
                                }}>Avbryt</button>
                                <button onClick={()=>{
                                    if(window.confirm("Ønsker du å slette " + behandlingForSletting + "?")){
                                        let tempBehandlinger = env.tjenester;
                                        tempBehandlinger = tempBehandlinger.filter((behandling)=>(behandling.navn !== behandlingForSletting));
                                        sendTilDatabase(env.frisorer, env.kategorier, tempBehandlinger, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
                                        sVisSlettBehandling(false);
                                    }
                                }}>Slett behandling</button>  
                            </div>  
                        </div>:<>
                        <button style={{display:"flex", alignItems:"center"}} onClick={()=>{
                            sVisSlettBehandling(true);
                        }} ><img alt='Slett en behandling' src="delete.png" ></img>Slett én behandling</button>
                        </>}


                        <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"1rem"}}>
                        {env.tjenester.map((behandling)=>(
                            <div key={behandling.navn} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                                <DetaljerBehandling behandlingsEstimater={behandlingsEstimater} behandling={behandling} env={env} sendTilDatabase={sendTilDatabase} />
                            </div>
                        ))}
                        </div>
                        
                        
                    </div>

                </>):""}
                    
        </div>
    )
}
/************************************************************************************************************************ */
function DetaljerBehandling({behandling, env, sendTilDatabase, behandlingsEstimater}){

    const [visRedigerBehandling, sVisRedigerBehandling] = useState(false);
    const [behandlingBeskrivelse, sBehandlingBeskrivelse] = useState(behandling.beskrivelse);
    const [behandlingPris, sBehandlingPris] = useState(behandling.pris);
    const [behandlingKategori, sBehandlingKategori] = useState(behandling.kategori);
    const [behandlingTid, sBehandlingTid] = useState(behandling.tid);

    //Vis rediger tid og rediger kategori
    const [visRedigerTid, sVisRedigerTid] = useState(false);
    const [visRedigerKategori, sVisRedigerKategori] = useState(false);


    return(<>
    
    {visRedigerBehandling?(<div className='fokus'>

        {behandling.navn}
        <div style={{display:"flex", flexDirection:"column"}}>
            <label>Pris: <input value={behandlingPris} onChange={(e)=>{
                sBehandlingPris(e.target.value);
            }}></input></label>

            <label>Beskrivelse: <input value={behandlingBeskrivelse} onChange={(e)=>{
                sBehandlingBeskrivelse(e.target.value);
            }}></input></label>
            
            <label>Kategori: {behandling.kategori} <button onClick={()=>{
                sVisRedigerKategori(!visRedigerKategori);
            }} >{visRedigerKategori?"Ferdig":"Rediger"}</button></label>

            
            {visRedigerKategori?<>
                <select value={behandlingKategori} onChange={(e)=>{
                    sBehandlingKategori(e.target.value);
                }}>
                    {env.kategorier.map((kategori)=>(
                        <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                </select>

            </>:""}

            <label>Estimert tid: {behandling.tid} <button onClick={()=>{
                sVisRedigerTid(!visRedigerTid);
            }}>{visRedigerTid?"Ferdig":"Rediger"}</button> </label>
            

            {visRedigerTid?<>
                <select value={behandlingTid} onChange={(e)=>{
                    sBehandlingTid(e.target.value);
                }}>
                    {behandlingsEstimater.map((tid)=>(
                        <option key={tid} value={tid}>{tid} minutter</option>
                    ))}
                </select>
            </>:""}
        </div>

    <div>
        <button onClick={()=>{
            sVisRedigerBehandling(false);
            sVisRedigerKategori(false);
            sVisRedigerTid(false);
            sBehandlingBeskrivelse(behandling.beskrivelse);
            sBehandlingPris(behandling.pris);
            sBehandlingKategori(behandling.kategori);
            sBehandlingTid(behandling.tid);

        }}>Avbryt</button>

        <button onClick={()=>{
            let tempBehandlinger = env.tjenester;
            let gjeldendeBehandling = tempBehandlinger.find((b)=>behandling.navn === b.navn);
            //if(alle krav er oppfylt for å lagre behandling)
            gjeldendeBehandling.beskrivelse = behandlingBeskrivelse;
            gjeldendeBehandling.pris = parseInt(behandlingPris);
            gjeldendeBehandling.tid = parseInt(behandlingTid);
            gjeldendeBehandling.kategori = behandlingKategori;
            sendTilDatabase(env.frisorer, env.kategorier, tempBehandlinger, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
            sVisRedigerBehandling(false);
            sVisRedigerKategori(false);
            sVisRedigerTid(false);
        }}>Lagre</button>
    </div>
    </div>):(<div>
            <h4>Behandling: {behandling.navn}</h4>
           

            <div className='redigeringsBoks'> <p>Pris: {behandling.pris} kr</p> </div>
            <div className='redigeringsBoks'> <p>Varighet: {behandling.tid} minutter</p> </div>
            <div className='redigeringsBoks'> <p>Kategori: {behandling.kategori}</p> </div>
            <button onClick={()=>{
                sVisRedigerBehandling(true);
            }} ><img alt='Rediger behandlinger' src='rediger.png' style={{height:"1.4rem"}}></img></button>
        </div>)}
        
    </>
    )
    
}

export default React.memo(Admin);