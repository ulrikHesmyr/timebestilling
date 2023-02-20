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
    //Søk timebestilling
    const [sok, sSok] = useState("");
    //Vis timebestillinger
    const [visRedigerTimebestillinger, sVisRedigerTimebestillinger] = useState(false);

    //Adresse
    const [visRedigerAdresse, sVisRedigerAdresse] = useState(false);
    const [adresse, sAdresse] = useState("");
    const [gatenavn, sGatenavn] = useState("");
    const [husnummer, sHusnummer] = useState("");
    const [postnummer, sPostnummer] = useState("");

    const [muligeAdresser, sMuligeAdresser] = useState([]);
    const [kanOppdatereAdresse, sKanOppdatereAdresse] = useState(false);


    //Kategori
    const [visNyKategori, sVisNyKategori] = useState(false);
    const [nyKategori, sNyKategori] = useState("");
    const [visSlettKategori, sVisSlettKategori] = useState(false);

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

    async function velgAdresse(){
        const res = await fetch(`https://ws.geonorge.no/adresser/v1/sok?fuzzy=false&adressenavn=${gatenavn}${(husnummer !== ""?`&nummer=${husnummer}`:"")}${(postnummer !== ""?`&postnummer=${postnummer}`:"")}&utkoordsys=4258&treffPerSide=30&side=0&asciiKompatibel=true`, {
            mode:'cors',
        })
        const data = await res.json()

        sMuligeAdresser(data.adresser);
    }

    async function oppdaterAdresse(){
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({adresse:adresse})
        }
        const request = await fetch("http://localhost:3001/env/oppdaterAdresse", options);
        const response = await request.json();
        if(response){
            sUpdateTrigger(!updateTrigger);
            varsle();
        }
    }


    async function oppdaterTimebestillinger(slettetTime){
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(slettetTime)
        }
        const request = await fetch("http://localhost:3001/timebestilling/oppdaterTimebestillinger", options);
        const response = await request.json();
        if(response.valid){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
    }

    async function sendTilDatabase(fris, kat, tje, klok, some, epost, tlf){
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
            varsle();
        }
    }


    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
                {env !== null? <div style={{display:"flex", flexDirection:"row"}}>
                
                    <button className='adminKnapper' style={{ borderRadius:"0.5rem 0 0 0", margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 1? "none":"2px solid black"), color:(synligKomponent=== 1? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(1);
                    }}>TIMEBESTILLINGER</button>

                
                    <button className='adminKnapper' style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 2? "none":"2px solid black"), color:(synligKomponent=== 2? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(2);
                    }}>FRIDAGER OG FRAVÆR</button>

                    <button className='adminKnapper' style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 3? "none":"2px solid black"), color:(synligKomponent=== 3? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(3);
                    }}>KONTAKT-INFO, KATEGORIER, FRISØRER etc.</button>
                    <button className='adminKnapper' style={{borderRadius:"0  0.5rem 0 0 ", margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 4? "none":"2px solid black"), color:(synligKomponent=== 4? "black":"rgba(0,0,0,0.5)")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(4);
                    }}>BEHANDLINGER</button>

                    </div>:""}

                
                <Fri env={env} bestilteTimer={bestilteTimer} synligKomponent={synligKomponent} varsle={varsle} />

                {synligKomponent === 1 && bestilteTimer !== null?(<>
                <h3>Timebestillinger</h3>

                {visRedigerTimebestillinger?
                <div className='fokus'>
                    <div alt='Lukk' className='lukk' onClick={()=>{
                        sVisRedigerTimebestillinger(false);
                        sSok("");
                    }}></div><br></br>
                    <h4>Finn og slett en timebestilling</h4>
                    <p>
                        Søk etter navnet eller telefonnummeret til en kunde og trykk på søppel-ikonet og deretter trykk "Ok" i dialogboksen for å slette timen.
                        <li>Dersom en kunde ønsker å flytte timen, så bestiller de en ny time, og  den forrige timen</li>
                    </p>

                    <label>Søk etter kunde eller telefonnummer: <input type="text" value={sok} onChange={(e)=>{
                        sSok(e.target.value);
                    }}></input></label>

                    {bestilteTimer.map((time, index)=>{
                        if(time.kunde.toUpperCase().indexOf(sok.toUpperCase()) > -1 || sok === ""){
                            return (
                                <div key={index} style={{display:'flex', flexDirection:"row", flexWrap:"wrap", padding:"0.3rem"}}>
                                    <li>{time.medarbeider}: {time.dato} {time.tidspunkt} KUNDE: {time.kunde} {time.telefonnummer} </li>
                                    <img alt='Slett time' className='ikonKnapper' onClick={()=>{
                                        if(window.confirm("Er du sikker på at du vil slette denne timebestillingen?")){
                                            oppdaterTimebestillinger(time);
                                        }
                                    }} src="delete.png"></img>
                                </div>
                            )
                        } else {
                            return "";      
                        }
                    })}

                </div> : 
                
                <button onClick={()=>{
                    sVisRedigerTimebestillinger(true);
                }} style={{width:"fit-content"}}><img className='ikonKnapper' alt='Rediger timebestillinger' src="rediger.png"></img></button>}

                <div>
                    {bestilteTimer.map((time, index)=>(
                                <div key={index}>
                                    <li>{time.medarbeider}: {time.dato} {time.tidspunkt} KUNDE: {time.kunde} {time.telefonnummer}</li>
                                </div>
                            )
                    )}
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
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <RedigerKontakt number={true} state={kontakt_tlf} setState={sKontakt_tlf} env={env} sendTilDatabase={sendTilDatabase} /><p>Kontakt telefon: </p> 
                        </div>
                        <p className='redigeringsElement'>{kontakt_tlf}</p>
                    </div>
                    <div className='redigeringsBoks'> 
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <RedigerKontakt number={false} state={kontakt_epost} setState={sKontakt_epost} env={env} sendTilDatabase={sendTilDatabase} /> <p>Kontakt e-post:</p>
                        </div>
                        <p className='redigeringsElement'>{kontakt_epost}</p>
                    </div>
                    <div className='redigeringsBoks'>
                        
                        {visRedigerAdresse?<div>
                            <div className='fokus'>
                                <div alt='Lukk' className='lukk' onClick={()=>{
                                    sVisRedigerAdresse(false);
                                }}></div><br></br>
                                <h4>Rediger adresse</h4>
                                <p>
                                    Her kan du redigere adressen til salongen. Søk på adressen du ønsker å endre til, klikk på riktig adresse fra adresseregisteret før du lagrer.
                                </p>
                                <p>Nåværende adresse: {env.adresse}</p>
                                <label>Gatenavn: <input type="text" value={gatenavn} onChange={(e)=>{
                                    sGatenavn(e.target.value);
                                    sKanOppdatereAdresse(false);
                                    sAdresse("");
                                    sMuligeAdresser([]);
                                    
                                }}></input></label>
                                <label>Husnummer: <input type="text" value={husnummer} onChange={(e)=>{
                                    if(/^\d*$/.test(e.target.value)){
                                        sHusnummer(e.target.value);
                                        sKanOppdatereAdresse(false);
                                        sAdresse("");
                                        sMuligeAdresser([]);
                                    }
                                    
                                }}></input></label>
                                <label>Postnummer: <input type="text" value={postnummer} onChange={(e)=>{
                                    if(/^\d*$/.test(e.target.value)){
                                        sPostnummer(e.target.value);
                                        sKanOppdatereAdresse(false);
                                        sAdresse("");
                                        sMuligeAdresser([]);
                                    }
                                    
                                }}></input></label>

                                <button onClick={()=>{
                                    if(gatenavn !== "" && husnummer !== "" && postnummer !== ""){
                                        velgAdresse();
                                    } else {
                                        alert("Du må fylle inn gatenavn, husnummer og postnummer for å søke etter adresser", 2);
                                    }
                                }}>Søk etter adresser</button>

                                <div className='muligeAdresser'>
                                    {muligeAdresser.map((adresse, index)=>{
                                        return (
                                            <div style={{fontWeight:"bold", margin:"0.2rem", padding:"0.3rem", cursor:"pointer", border:"thin solid black"}} key={index} onClick={()=>{
                                                sAdresse(`${adresse.adressenavn} ${adresse.nummer}${adresse.bokstav}, ${adresse.postnummer} ${adresse.kommunenavn}`);
                                                sKanOppdatereAdresse(true);
                                            }}>{adresse.adressenavn} {adresse.nummer}{adresse.bokstav}, {adresse.postnummer} {adresse.kommunenavn}</div>
                                        )}
                                    )}
                                </div>
                                <p>{adresse !== ""?`Valgt adresse: ${adresse}`:""}</p>
                                
                                <div>
                                <button onClick={()=>{
                                    sVisRedigerAdresse(false);
                                    sGatenavn("");
                                    sHusnummer("");
                                    sPostnummer("");
                                    sAdresse("");
                                    sMuligeAdresser([]);
                                }}>Avbryt</button>
                                <button onClick={()=>{
                                   if(kanOppdatereAdresse){
                                        if(window.confirm("Er du sikker på at du vil redigere adressen til: " + adresse + "?")){
                                        oppdaterAdresse();
                                        sGatenavn("");
                                        sHusnummer("");
                                        sPostnummer("");
                                        sAdresse("");
                                        sMuligeAdresser([]);
                                        sVisRedigerAdresse(false);
                                        }
                                    } else {
                                        alert("Du må velge en adresse fra adresseregisteret før du kan oppdatere adressen.");
                                    }
                                }}>Lagre</button>
                                </div>
                            </div>
                        </div>:<> <div> <button onClick={()=>{
                            sVisRedigerAdresse(true);
                        }}><img alt="rediger adresse" src="rediger.png" className='ikonKnapper'></img></button> Adresse:</div><p className='redigeringsElement'>{env.adresse}</p></>}
                    </div>
                    <div className='redigeringsBoks'>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <RedigerPassord redigerPassordDB={redigerPassordDB} /> <p>Passord for admin</p> 
                        </div>
                    </div>
                    
                </div>
                <div>
                    <h4>Frisører:</h4>
                    <div className='frisorOversikt'>
                        {env.frisorer.map((frisor)=>(
                                <div key={frisor.navn}>
                                    <DetaljerFrisor frisor={frisor} env={env} sendTilDatabase={sendTilDatabase} varsle={varsle} updateTrigger={updateTrigger} sUpdateTrigger={sUpdateTrigger} />
                                </div>
                        ))}
                    </div>
                    {env !== null?<LeggTilFrisor env={env} varsle={varsle} updateTrigger={updateTrigger} sUpdateTrigger={sUpdateTrigger} />:""}
                    
                </div>

                <div>
                    <h4>Kategorier:</h4>
                    
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    {visNyKategori?
                        <div className='fokus'>
                            <label>Ny kategori: <input type="text" maxLength={30} value={nyKategori} onChange={(e)=>{
                                sNyKategori(e.target.value);
                            }}></input></label>

                            <div>
                                <button onClick={()=>{
                                    sVisNyKategori(false);
                                    sNyKategori("");
                                }}>Avbryt</button>
                                <button onClick={()=>{
                                    if(nyKategori !== ""){
                                        sVisNyKategori(false);
                                        
                                        let nyKategoriListe = env.kategorier;
                                        nyKategoriListe.push(nyKategori);
                                        sendTilDatabase(env.frisorer, nyKategoriListe, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
                                        sNyKategori("");
                                    }
                                }}>Opprett</button>
                            </div>
                        </div>
                        
                        :
                        <button onClick={()=>{
                            sVisNyKategori(true);
                        }} style={{display:"flex", alignItems:"center"}}>
                            <img className='ikonKnapper' alt='Opprett ny kategori' src="leggtil.png"></img>Opprett ny kategori
                        </button>}

                        {visSlettKategori?<div className='fokus'>
                            <div>
                                <div alt='Lukk' className='lukk' onClick={()=>{
                                    sVisSlettKategori(false);
                                }}></div>
                                <h4><br></br>Kategorier:</h4>
                                <p>Kun kategorier som ikke er oppført for en behandling, kan slettes. Dette sjekkes dersom du prøver 
                                    å slette en kategori som fortsatt er i bruk, slik at det ikke oppstår feil.</p>
                                {env.kategorier.map((kategori, index)=>(
                                <div key={kategori}>
                                    <p style={{display:"flex", alignItems:"center", fontSize:"larger"}}>{kategori} <img className='ikonKnapper' alt="Slett kategori" src="delete.png" onClick={()=>{
                                       if(!env.tjenester.find(t=>t.kategori === kategori)){
                                            if(window.confirm("Er du sikker på at du vil slette denne kategorien?")){
                                                sVisSlettKategori(false);
                                                let nyKategoriListe = env.kategorier;
                                                nyKategoriListe.splice(index, 1);
                                                sendTilDatabase(env.frisorer, nyKategoriListe, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
                                            }
                                        } else {
                                            alert("Det eksisterer tjenester i denne kategorien. Du må først slette eller endre disse tjenestene for å slette kategorien.")
                                       }
                                    }}></img></p>
                                </div>
                                ))}

                            </div>
                        </div>:
                            <button style={{display:"flex", alignItems:"center"}} onClick={()=>{
                                sVisSlettKategori(true);
                            }}><img className='ikonKnapper'  alt='Rediger kategorier' src="rediger.png"></img>Rediger kategorier</button>
                        }
                        </div>


                    {env.kategorier.map((kategori)=>(
                        <div key={kategori}>
                            <p>{kategori}</p>
                        </div>
                    ))}


                </div>

                <div>
                <h4>Åpningstider:</h4>
                    {visRedigerAapningstider?<>
                        <RedigerAapningstider env={env} sendTilDatabase={sendTilDatabase} dag={dagForRedigering} sVisRedigerAapningstider={sVisRedigerAapningstider}/>
                    </> :env.klokkeslett.map((klokkeslett, index)=>(
                        <div key={index} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                         {klokkeslett.dag}: {klokkeslett.stengt?"Stengt" :klokkeslett.open} {klokkeslett.stengt?"": "-"} {klokkeslett.stengt?"": klokkeslett.closed}
                         <button onClick={()=>{
                            sDagForRedigering(klokkeslett);
                            sVisRedigerAapningstider(true);
                         }}><img className='ikonKnapper' alt='rediger' src="rediger.png"></img></button>
                        </div>
                    ))}
                </div>

                

                
            </div></>
            ):""}
            {synligKomponent === 4 && env !== null?(
            <>
                <div>
                <h3>Behandlinger:</h3>
                {visOpprettBehandling?
                    <div className='fokus'>
                        <h4>Opprett ny behandling:</h4>
                        <p>Legg til en ny behandling i applikasjonen. <br></br>
                        Denne behandlingen vil da bli mulig å velge for kunder når de bestiller time.</p>
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
                    }} ><img className='ikonKnapper' alt='Legg til frisør' src="leggtil.png" ></img>Opprett ny behandling</button>
                    
                    
                    </>
                    }
                    
                    {visSlettBehandling?
                    <div className='fokus'>
                        <h4>Velg behandling som skal slettes:</h4>
                        <p>Sletter behandling slik at det ikke er mulig for kunder å reservere time for denne behandlingen
                        fra og med tidspunktet den er slettet. Dersom kunder allerede har reservert for følgende behandling, vil denne
                        timesreservasjonen gjennomføres.</p>
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
                    }} ><img className='ikonKnapper' alt='Slett en behandling' src="delete.png" ></img>Slett én behandling</button>
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
    </div>):(<div style={{display:"flex", flexDirection:"column", flexWrap:"wrap", justifyContent:"center"}}>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <h4>Behandling: {behandling.navn}</h4>
                    <button onClick={()=>{
                        sVisRedigerBehandling(true);
                    }} ><img alt='Rediger behandlinger' src='rediger.png' className='ikonKnapper'></img>
                    </button>
                </div>
           

            <div className='redigeringsBoks'> <p>Pris: {behandling.pris} kr</p> </div>
            <div className='redigeringsBoks'> <p>Varighet: {behandling.tid} minutter</p> </div>
            <div className='redigeringsBoks'> <p>Kategori: {behandling.kategori}</p> </div>
            
        </div>)}
        
    </>
    )
    
}

export default React.memo(Admin);