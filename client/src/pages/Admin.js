import React, { useState, useEffect} from 'react'
import LeggTilFrisor from '../components/LeggTilFrisor';
import DetaljerFrisor from '../components/DetaljerFrisor';
import Fri from '../components/Fri';
import SMS from '../components/SMS';
import {Link} from 'react-router-dom';
import { hentMaaned } from '../App';
import OffentligeSkisser from '../components/OffentligeSkisser';

function Admin({env, bruker, bestilteTimer, sUpdateTrigger, updateTrigger, varsle, lagreVarsel, varsleFeil}){

    const behandlingsEstimater = [15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240];

    const [visRedigerAapningstider, sVisRedigerAapningstider] = useState(false);
    const [dagForRedigering, sDagForRedigering] = useState();
    //Søk timebestilling
    const [sok, sSok] = useState("");
    //Vis timebestillinger
    const [visRedigerTimebestillinger, sVisRedigerTimebestillinger] = useState(false);

    //hoytidsdager
    const [visRedigerHoytidsdager, sVisRedigerHoytidsdager] = useState(false);
    const [hoytidsdag, sHoytidsdag] = useState("");
    const [hoytidsdato, sHoytidsdato] = useState("");
    const [leggtilhoytid, sLeggtilhoytid] = useState(false);

    //Adresse
    const [visRedigerAdresse, sVisRedigerAdresse] = useState(false);
    const [adresseTekst, sAdresseTekst] = useState(`${env.adresse.gatenavn} ${env.adresse.husnummer}${env.adresse.bokstav?env.adresse.bokstav:""}, ${env.adresse.postnummer} ${env.adresse.poststed}`);
    const [adresse, sAdresse] = useState(env.adresse);
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
    const [behandlingForSletting, sBehandlingForSletting] = useState(env.tjenester[0].navn);

    
    //Synlige sider
    const [synligKomponent, setSynligKomponent] = useState(1);

    //Sosiale medier
        //Opprett nytt sosialt medie
    let muligeSosialeMedier = ["YouTube", "Twitter", "Tiktok","Snapchat","LinkedIn", "Facebook", "Instagram"];
    const [visLeggTilSosialtMedie, sVisLeggTilSosialtMedie] = useState(false);
    const [nyttMedie, sNyttMedie] = useState(muligeSosialeMedier.filter(m=>!env.sosialeMedier.map(e=>e.platform).includes(m))[0]);
    const [brukerNyttMedie, sBrukerNyttMedie] = useState("");
    const [linkNyttMedie, sLinkNyttMedie] = useState("");
        //Slett sosialt medie
    const [visSlettSosialtMedie, sVisSlettSosialtMedie] = useState(false);

    //Navigasjonsburger
    const [menySynlig, sMenySynlig] = useState(false);

    //Om oss
    useEffect(()=>{
        sAdresse(env.adresse);
        sAdresseTekst((`${env.adresse.gatenavn} ${env.adresse.husnummer}${env.adresse.bokstav?env.adresse.bokstav:""}, ${env.adresse.postnummer} ${env.adresse.poststed}`));
        sNyBehandlingKategori(env.kategorier[0]);
        sBehandlingForSletting(env.tjenester[0].navn);
    }, [env]);

    //Sletter en høytidsdag
    async function slettHoytidsdag(d){
        lagreVarsel();
        try {
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({dag:d}),
                //credentials:'include'

            }
            const request = await fetch("http://localhost:1227/env/slettHoytidsdag", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            varsleFeil();
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
        }
    }
    
    //Legg til høytidsdag
    async function leggTilHoytidsDag(){
        try {
            lagreVarsel();
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({dag:hoytidsdag, dato:hoytidsdato}),
                //credentials:'include'

            }
            const request = await fetch("http://localhost:1227/env/leggTilHoytidsdag", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }
    //Legger til nytt sosialt medie
    async function leggTilSosialtMedie(medie){
        try {
            lagreVarsel();
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({medie:medie}),
                //credentials:'include'

            }
            const request = await fetch("http://localhost:1227/env/leggTilSosialtMedie", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }


    //Sletter kategori
    async function slettKategori(kategori){
        try {
            lagreVarsel();
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({kategori:kategori}),
                //credentials:'include'
            
            }
            const request = await fetch("http://localhost:1227/env/slettKategori", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }

    //Oppretter ny kategori
    async function opprettNyKategori(){
        try {
            lagreVarsel();
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({kategori:nyKategori}),
                //credentials:'include'
            
            }
            const request = await fetch("http://localhost:1227/env/nyKategori", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }

    //Sletter en behandling
    async function slettBehandling(b){
        try {
            lagreVarsel();
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({behandling:b}),
            //credentials:'include'

        }
        const request = await fetch("http://localhost:1227/env/slettBehandling", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }

    //Opprett ny behandling
    async function opprettNyBehandling(b){
        try {
            lagreVarsel();
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({behandling:b}),
            //credentials:'include'
        }
        const request = await fetch("http://localhost:1227/env/opprettNyBehandling", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }



    async function velgAdresse(){
       try {
        const res = await fetch(`https://ws.geonorge.no/adresser/v1/sok?fuzzy=false&adressenavn=${gatenavn}${(husnummer !== ""?`&nummer=${husnummer}`:"")}${(postnummer !== ""?`&postnummer=${postnummer}`:"")}&utkoordsys=4258&treffPerSide=30&side=0&asciiKompatibel=true`, {
            mode:'cors',
        })
        const data = await res.json()

        sMuligeAdresser(data.adresser);
       } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
        varsleFeil();
       }
    }

    async function oppdaterAdresse(){
       try {
        lagreVarsel();
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({adresse:adresse}),
            //credentials:'include'
        }
        const request = await fetch("http://localhost:1227/env/oppdaterAdresse", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
       } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
        varsleFeil();
       }
    }


    async function oppdaterTimebestillinger(slettetTime){
        try {
            lagreVarsel();
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(slettetTime),
            //credentials:'include'
        }
        const request = await fetch("http://localhost:1227/timebestilling/oppdaterTimebestillinger", options);
        const response = await request.json();
        if(response.valid){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();   
        }
    }


    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
            { env !== null ?<>
                <img style={{width:"4rem"}} 
                src="rekkefolge.png" alt="Navigasjonsburger"
                onClick={()=>{
                    sMenySynlig(!menySynlig);
                }}></img>
                <div style={{position:"relative"}}>
                    <div className={menySynlig?'adminKnapper':"ikkesynlig adminKnapper"}>
                    
                        <div className={synligKomponent === 1?'aktivSide adminKnapp':"adminKnapp"} onClick={(e)=>{
                            e.preventDefault();
                            setSynligKomponent(1);
                            sMenySynlig(false);
                        }}>TIMEBESTILLINGER</div>
        
                    
                        <div className={synligKomponent === 2?'aktivSide adminKnapp':"adminKnapp"} onClick={(e)=>{
                            e.preventDefault();
                            setSynligKomponent(2);
                            sMenySynlig(false);
                        }}>FRIDAGER OG FRAVÆR</div>
        
                        <div className={synligKomponent === 3?'aktivSide adminKnapp':"adminKnapp"} onClick={(e)=>{
                            e.preventDefault();
                            setSynligKomponent(3);
                            sMenySynlig(false);
                        }}>KONTAKT-INFO, KATEGORIER, ANSATTE etc.</div>
        
                        <div className={synligKomponent === 4?'aktivSide adminKnapp':"adminKnapp"} onClick={(e)=>{
                            e.preventDefault();
                            setSynligKomponent(4);
                            sMenySynlig(false);
                        }}>BEHANDLINGER</div>
        
                        <div className={synligKomponent === 5?'aktivSide adminKnapp':"adminKnapp"} onClick={(e)=>{
                            e.preventDefault();
                            setSynligKomponent(5);
                            sMenySynlig(false);
                        }}>SMS</div>
        
    
                    </div>
                </div>

                
                
                <Fri env={env} bestilteTimer={bestilteTimer} synligKomponent={synligKomponent} lagreVarsel={lagreVarsel} varsle={varsle} varsleFeil={varsleFeil} />

                {synligKomponent === 5? <SMS env={env} varsleFeil={varsleFeil} varsle={varsle} lagreVarsel={lagreVarsel} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} />:""}

                
                {synligKomponent === 1 && bestilteTimer !== null?(<div className='fjernTimebestillingerSiden'>
                <h3>Timebestillinger</h3>
                <p>Bestill time her: <Link to="/">bestill time</Link> </p>

                {visRedigerTimebestillinger?
                <div className='fokus'>
                    <div className='lukk' onClick={()=>{
                        sVisRedigerTimebestillinger(false);
                        sSok("");
                    }}></div><br></br>
                    <h4>Finn og slett en timebestilling</h4>
                    <p>
                        Søk etter navnet eller telefonnummeret til en kunde og trykk på søppel-ikonet og deretter trykk "Ok" i dialogboksen for å slette timen.
                        <li>Dersom en kunde ønsker å flytte timen, så bestiller de en ny time, og  den forrige timen slettes nedenfor</li>
                    </p>

                    <label>Søk etter kunde eller telefonnummer: <input type="text" value={sok} onChange={(e)=>{
                        sSok(e.target.value);
                    }}></input></label>

                    {bestilteTimer.map((time, index)=>{
                        if(time.kunde.toUpperCase().indexOf(sok.toUpperCase()) > -1 || sok === "" || time.telefonnummer.toString().toUpperCase().indexOf(sok.toUpperCase()) > -1){
                            return (
                                <div key={index} style={{display:'flex', flexDirection:"row", flexWrap:"wrap", padding:"0.3rem"}}>
                                    <li>{time.medarbeider}: {parseInt(time.dato.substring(8,10))}. {hentMaaned(parseInt(time.dato.substring(5,7)) -1)} {time.tidspunkt} KUNDE: {time.kunde} {time.telefonnummer} </li>
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
                                    <li>{time.medarbeider}: {parseInt(time.dato.substring(8,10))}. {hentMaaned(parseInt(time.dato.substring(5,7)) -1)} {time.tidspunkt} KUNDE: {time.kunde} {time.telefonnummer}</li>
                                </div>
                            )
                    )}
                </div>
                </div>
                    
            ):""}


            {synligKomponent === 3?(
                <div className='redigerAnsatteOsvSiden'>
                
                <h3>Ansatte, kategorier, åpningstider og kontakt-info</h3>
                
            <div className='adminMain'>
                <div>


                    <div className='redigeringsBoks'>
                        {visRedigerHoytidsdager?<div className='fokus'>
                            <div onClick={()=>{
                                sVisRedigerHoytidsdager(false);
                            }} className='lukk'></div>
                            <h4>Rediger høytidsdager</h4>
                            <p>
                                Her kan du legge inn de dagene i året hvor salongen er stengt. Datoene gjentar seg hvert år, så det er ikke behov for å legge inn samme dato flere ganger.
                            </p>

                            {leggtilhoytid?<>
                            <label>Dag: <input onChange={(e)=>{
                                sHoytidsdag(e.target.value);
                            }} value={hoytidsdag} type='text' placeholder='Eks.: Julaften'></input></label>
                            <label>Dato: <input type="date" value={hoytidsdato} onChange={(e)=>{
                                sHoytidsdato(e.target.value);
                            }}></input></label>
                            <div>
                                <button onClick={()=>{
                                    sLeggtilhoytid(false);
                                    sHoytidsdag("");
                                    sHoytidsdato("");
                                }}>
                                    Avbryt
                                </button>
                                <button disabled={hoytidsdag === "" || hoytidsdato === ""} onClick={()=>{
                                    sVisRedigerHoytidsdager(false);
                                    sLeggtilhoytid(false);
                                    leggTilHoytidsDag();
                                }}>
                                    Lagre
                                </button>
                            </div></>:<button style={{display:"flex", alignItems:"center", flexDirection:"row"}} onClick={()=>{
                                sLeggtilhoytid(true);
                            }}> <img alt='Vis legg til høytid modul' className='ikonKnapper' src='leggtil.png'></img>
                                Legg til høytidsdag
                                </button>}
                            <div >
                                {env.hoytidsdager.map((dag, index)=>{
                                    return(
                                        <div key={index}>
                                            <p>{dag.dag} {parseInt(dag.dato.substring(8,10))}. {hentMaaned(parseInt(dag.dato.substring(5,7)) -1)} <img onClick={()=>{
                                                if(window.confirm("Er du sikker på at du vil slette denne høytidsdagen?")){
                                                    slettHoytidsdag(dag.dag);
                                                }
                                            }} alt='Slett høytid' className='ikonKnapper' src="delete.png"></img> </p>
                                        </div>
                                    )
                                })}    
                            </div>


                        </div>: <div> 
                            <button className='redigerKnapp' onClick={()=>{
                                sVisRedigerHoytidsdager(true);
                            }}></button>Høytidsdager
                            <div className='redigeringsElement'>
                            {env.hoytidsdager.map((dag, index)=>{
                                    return(
                                        <div key={index}>
                                            <p>{dag.dag} - {parseInt(dag.dato.substring(8,10))}. {hentMaaned(parseInt(dag.dato.substring(5,7)) -1)} </p>
                                        </div>
                                    )
                                })}  
                            </div>
                        </div>}
                       
                    </div>
                    
                    <div className='redigeringsBoks'>
                        
                        {visRedigerAdresse?<div>
                            <div className='fokus'>
                                <div className='lukk' onClick={()=>{
                                    sVisRedigerAdresse(false);
                                }}></div><br></br>
                                <h4>Rediger adresse</h4>
                                <p>
                                    Her kan du redigere adressen til salongen. Søk på adressen du ønsker å endre til, klikk på riktig adresse fra adresseregisteret før du lagrer.
                                </p>
                                <p>Nåværende adresse: {adresseTekst}</p>
                                <label>Gatenavn: <input type="text" value={gatenavn} onChange={(e)=>{
                                    sGatenavn(e.target.value);
                                    sKanOppdatereAdresse(false);
                                    sAdresse({});
                                    sMuligeAdresser([]);
                                    
                                }}></input></label>
                                <label>Husnummer: <input type="text" value={husnummer} onChange={(e)=>{
                                    if(/^\d*$/.test(e.target.value)){
                                        sHusnummer(e.target.value);
                                        sKanOppdatereAdresse(false);
                                        sAdresse({});
                                        sMuligeAdresser([]);
                                    }
                                    
                                }}></input></label>
                                <label>Postnummer: <input type="text" value={postnummer} onChange={(e)=>{
                                    if(/^\d*$/.test(e.target.value)){
                                        sPostnummer(e.target.value);
                                        sKanOppdatereAdresse(false);
                                        sAdresse({});
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
                                    {muligeAdresser.map((a, index)=>{
                                        return (
                                            <div style={{fontWeight:"bold", margin:"0.2rem", padding:"0.3rem", cursor:"pointer", border:"thin solid black"}} key={index} onClick={()=>{
                                                sAdresse({gatenavn:a.adressenavn, husnummer:a.nummer, postnummer:a.postnummer, poststed:a.kommunenavn, bokstav:a.bokstav, rep:{lat:a.representasjonspunkt.lat, lon:a.representasjonspunkt.lon}});
                                                sAdresseTekst(`${a.adressenavn} ${a.nummer}${a.bokstav}, ${a.postnummer} ${a.kommunenavn}`);
                                                sKanOppdatereAdresse(true);
                                            }}>{a.adressenavn} {a.nummer}{a.bokstav}, {a.postnummer} {a.kommunenavn}</div>
                                        )}
                                    )}
                                </div>
                                <p>{adresse !== {}?`Valgt adresse: ${adresseTekst}`:""}</p>
                                
                                <div>
                                <button onClick={()=>{
                                    sVisRedigerAdresse(false);
                                    sGatenavn("");
                                    sHusnummer("");
                                    sPostnummer("");
                                    sAdresse({});
                                    sAdresseTekst(`${env.adresse.gatenavn} ${env.adresse.husnummer}${env.adresse.bokstav?env.adresse.bokstav:""}, ${env.adresse.postnummer} ${env.adresse.poststed}`);
                                    sMuligeAdresser([]);
                                }}>Avbryt</button>
                                <button disabled={!kanOppdatereAdresse} onClick={()=>{
                                   if(kanOppdatereAdresse){
                                        if(window.confirm("Er du sikker på at du vil redigere adressen til: " + adresseTekst + "?")){
                                        oppdaterAdresse();
                                        sGatenavn("");
                                        sHusnummer("");
                                        sPostnummer("");
                                        sAdresse({});
                                        sMuligeAdresser([]);
                                        sVisRedigerAdresse(false);
                                        }
                                    } else {
                                        alert("Du må velge en adresse fra adresseregisteret før du kan oppdatere adressen.");
                                    }
                                }}>Lagre</button>
                                </div>
                            </div>
                        </div>:<> <div> <button className='redigerKnapp' onClick={()=>{
                            sVisRedigerAdresse(true);
                        }}></button> Adresse:</div><p className='redigeringsElement'>{adresseTekst}</p></>}
                    </div>
                    
                    
                </div>
                <div>
                    <h4>Ansatte:</h4>
                    <p>Trykk på bilde av ansatt for å se detaljer eller endre</p>
                    <div className='frisorOversikt'>
                        {env.frisorer.map((frisor)=>(
                                <div key={frisor.navn}>
                                    <DetaljerFrisor frisor={frisor} bruker={bruker} env={env} varsleFeil={varsleFeil} lagreVarsel={lagreVarsel} varsle={varsle} updateTrigger={updateTrigger} sUpdateTrigger={sUpdateTrigger} />
                                </div>
                        ))}
                    </div>
                    <LeggTilFrisor env={env} lagreVarsel={lagreVarsel} varsle={varsle} updateTrigger={updateTrigger} varsleFeil={varsleFeil} sUpdateTrigger={sUpdateTrigger} />
                    
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
                                    if(nyKategori !== "" && !env.kategorier.includes(nyKategori)){
                                        sVisNyKategori(false);
                                        opprettNyKategori();
                                        sNyKategori("");
                                    } else {
                                        alert("Kategorier må være unike");
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
                                <div className='lukk' onClick={()=>{
                                    sVisSlettKategori(false);
                                }}></div>
                                <h4><br></br>Kategorier:</h4>
                                <p>Kun kategorier som ikke er oppført for en behandling, kan slettes. Dette sjekkes dersom du prøver 
                                    å slette en kategori som fortsatt er i bruk, slik at det ikke oppstår feil.</p>
                                {env.kategorier.map((kategori)=>(
                                <div key={kategori}>
                                    <p style={{display:"flex", alignItems:"center", fontSize:"larger"}}>{kategori} <img className='ikonKnapper' alt="Slett kategori" src="delete.png" onClick={()=>{
                                       if(!env.tjenester.find(t=>t.kategori === kategori)){
                                            if(window.confirm("Er du sikker på at du vil slette denne kategorien?")){
                                                sVisSlettKategori(false);
                                                slettKategori(kategori);
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
                            }}><div className='redigerKnapp'></div>Rediger kategorier</button>
                        }
                        </div>


                    {env.kategorier.map((kategori)=>(
                        <div key={kategori}>
                            <p>{kategori}</p>
                        </div>
                    ))}


                </div>

                <OffentligeSkisser varsle={varsle} varsleFeil={varsleFeil} lagreVarsel={lagreVarsel} env={env} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} />


                

                
            </div></div>
            ):""}
            {synligKomponent === 4?(
            <>
                <div className='redigerBehandlinger'>
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
                                <button disabled={!(nyBehandlingNavn !== "" && nyBehandlingBeskrivelse !== "" && !isNaN(parseInt(nyBehandlingPris)) && nyBehandlingKategori !== "" && !isNaN(parseInt(nyBehandlingPris)) && !env.tjenester.map(t=>t.navn).includes(nyBehandlingNavn))} onClick={()=>{
                                    if(nyBehandlingNavn !== "" && nyBehandlingBeskrivelse !== "" && !isNaN(parseInt(nyBehandlingPris)) && nyBehandlingKategori !== "" && !isNaN(parseInt(nyBehandlingPris)) && !env.tjenester.map(t=>t.navn).includes(nyBehandlingNavn)){
                                        
                                        opprettNyBehandling({navn:nyBehandlingNavn, beskrivelse:nyBehandlingBeskrivelse, pris:parseInt(nyBehandlingPris), kategori:nyBehandlingKategori, tid:(parseInt(nyBehandlingTid))})
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
                    }} ><img className='ikonKnapper' alt='Legg til medarbeider' src="leggtil.png" ></img>Opprett ny behandling</button>
                    
                    
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
                                sBehandlingForSletting(env.tjenester[0].navn);
                            }}>Avbryt</button>
                            <button onClick={()=>{
                                if(window.confirm("Ønsker du å slette " + behandlingForSletting + "?")){
                                    slettBehandling(behandlingForSletting);
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
                    {env.tjenester.slice(0).reverse().map((behandling)=>(
                        <div className='behandlingAdminPanel' key={behandling.navn}>
                            <DetaljerBehandling lagreVarsel={lagreVarsel} varsle={varsle} varsleFeil={varsleFeil} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} behandlingsEstimater={behandlingsEstimater} behandling={behandling} env={env} />
                        </div>
                    ))}
                    </div>
                    
                    
                </div>
            </>):""}
            </>:<div className='laster'></div>}
        </div>
    )
}
/************************************************************************************************************************ */
function DetaljerBehandling({behandling, env, lagreVarsel, varsle, varsleFeil, sUpdateTrigger, updateTrigger, behandlingsEstimater}){

    const [visRedigerBehandling, sVisRedigerBehandling] = useState(false);
    const [behandlingBeskrivelse, sBehandlingBeskrivelse] = useState(behandling.beskrivelse);
    const [behandlingPris, sBehandlingPris] = useState(behandling.pris);
    const [behandlingKategori, sBehandlingKategori] = useState(behandling.kategori);
    const [behandlingTid, sBehandlingTid] = useState(behandling.tid);

    //Vis rediger tid og rediger kategori
    const [visRedigerTid, sVisRedigerTid] = useState(false);
    const [visRedigerKategori, sVisRedigerKategori] = useState(false);

    
    async function oppdaterBehandling(t){
        try {
            lagreVarsel();
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({tjeneste: t}),
                //credentials:'include'

            }
            const request = await fetch("http://localhost:1227/env/oppdaterBehandling", options);
            const response = await request.json();
            if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();
        }
    }
    

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
            
            <label>Kategori: {behandlingKategori} <button onClick={()=>{
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

            <label>Estimert tid: {behandlingTid} <button onClick={()=>{
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

        <button disabled={behandling.tid === behandlingTid && behandling.pris === behandlingPris && behandling.beskrivelse === behandlingBeskrivelse && behandling.kategori === behandlingKategori} onClick={()=>{
            oppdaterBehandling({navn: behandling.navn, pris:parseInt(behandlingPris), tid:parseInt(behandlingTid), beskrivelse:behandlingBeskrivelse, kategori:behandlingKategori});
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