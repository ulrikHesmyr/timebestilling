import React, {useState, useRef} from 'react'

function PersonInfo({skisseFiler, env, smsBekreftelse, sSmsBekreftelse, totalTid, totalPris, dato, klokkeslettet, produkt, frisor, hentMaaned, isMobile, synligKomponent, displayKomponent, navn, telefonnummer, nullstillData, setReservasjon ,setUpdate ,updateDataTrigger, data, sNavn, sTelefonnummer}){
    
    const [harregistrert, sHarRegistrert] = useState(false); //For å passe på at en bruker ikke trykker to ganger før neste side rekker å laste inn
    const [validertSMSpin, sValidertSMSpin] = useState(!env.aktivertSMSpin); 
    
    const [visPINBoks, sVisPINBoks] = useState(false);
    const [pin, sPIN] = useState('');
    const [tryktOK, sTryktOK] = useState(!env.aktivertSMSpin);
    const [skrevetFerdigTlf, sSkrevetFerdigTlf] = useState(false);
    const [visLaster, sVisLaster] = useState(false);

    const [visIkkeGodkjent, sVisIkkeGodkjent] = useState(false);
    const sendReservasjonBoks = useRef(null);
    const scrollPINBoks = useRef(null);
    const verifiserKnapp = useRef(null);
    
    let format = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~]/;

    async function validerPIN(p){
        const request = await fetch("/timebestilling/tlfpin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({pin:p}),
            credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        }
        if(response.valid){
            sVisLaster(false);
            sValidertSMSpin(true);
            sVisIkkeGodkjent(false);
            sendReservasjonBoks.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        } else {
            sValidertSMSpin(false);
            sVisIkkeGodkjent(true);
        }
    }
    async function validerSMSpin(){
        sTryktOK(true);
        const request = await fetch("/timebestilling/SMSpin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({tlf:telefonnummer}),
            credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        } else if(response.valid){
            sValidertSMSpin(true);
            sendReservasjonBoks.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        } else if(!response.valid) {
            sVisPINBoks(true);
            scrollPINBoks.current.scrollIntoView({behavior: "smooth", block:"center"});

        }
    }
    async function registrerData(){

        let formData = new FormData();
        if(skisseFiler.length > 0){
            for(let i = 0; i < skisseFiler.length; i++){
                formData.append("fil", skisseFiler[i]);
            }
        }

        for(let i = 0; i < data.behandlinger.length; i++){
            formData.append("behandlinger", data.behandlinger[i]);
        } 
        
        for(let i = 0; i < data.valgteSkisser.length; i++){
            formData.append("valgteSkisser", data.valgteSkisser[i]);
        } 
        formData.append("dato", data.dato);
        formData.append("kunde", data.kunde);
        formData.append("medarbeider", data.medarbeider);
        formData.append("telefonnummer", data.telefonnummer);
        formData.append("tidspunkt", data.tidspunkt);
        formData.append("SMS_ENABLED", data.SMS_ENABLED);


        const request = await fetch("/timebestilling/bestilltime", {
            method:"POST",
            body: formData,
            credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        } else if(response.bestillingAlreadyExcist){
            alert("Denne timen er opptatt, noen har bestilt time samtidig som deg, men sendte inn registrering først, prøv på nytt!");
            sHarRegistrert(false);
        } else if(!response.valid){
            alert("Noe har skjedd galt, sjekk internettforbindelsen din og prøv på nytt!");
        } else if(response){
            setUpdate(!updateDataTrigger);
            setReservasjon(response.bestiltTime);
            nullstillData();
            displayKomponent(0);
        } else {
            alert("Noe har skjedd galt, sjekk internettforbindelsen din og prøv på nytt!");
        }
    }

    return (
        <div className={synligKomponent === 4? 'animer-inn':''}>
            <form name='dinInfo' id='dinInfo'>
                <label htmlFor="navn">Navn: * <input aria-label='Navn' required aria-required maxLength={20} value={navn} type="text" placeholder='Navn Navnesen' name='navn' id='navn' onChange={(e)=>{
                    if(!format.test(e.target.value)){ //Legg inn regex
                        sNavn(e.target.value);
                    }
                }}></input> </label>

                <label htmlFor="telefonnummer">Telefon: * +47 <input aria-label='Telefonnummer, 8-siffer' required aria-required maxLength={8} inputMode="numeric" value={telefonnummer} type="text" name="telefonnummer" id="telefonnummer" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue) && (e.target.value.length === 0 || e.target.value[0] === "4" || e.target.value[0] === "9")){
                        sTelefonnummer(newValue);
                        if(tryktOK){
                            sTryktOK(false);
                        }
                        if(validertSMSpin && env.aktivertSMSpin){
                            sValidertSMSpin(false);
                        }
                        if(visPINBoks){
                            sVisPINBoks(false);
                            sPIN('');
                        }
                        if(e.target.value.length === 8){
                            sSkrevetFerdigTlf(true);
                            if(!visPINBoks && !validertSMSpin && !tryktOK){
                                verifiserKnapp.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                            }
                        }
                    } 
                    }}></input> NB 8 siffer

                </label>

                
                {!visPINBoks && !validertSMSpin && !tryktOK && skrevetFerdigTlf?<label ref={verifiserKnapp} htmlFor='verifiser'>Verifiser telefonnummer: <button id="verifiser" name='verifiser' aria-label="Valider telefonnummer. Du vil motta en SMS" onClick={(e)=>{
                    e.preventDefault();
                    if(telefonnummer.length === 8){
                        validerSMSpin();
                    } else {
                        alert("Telefonnummeret må være 8 siffer langt");

                    }
                }}>VERIFISER</button></label>:""}

                
                

                {visPINBoks?(
                    <div>
                        <p>Vi har sendt deg en SMS med en PIN-kode, vennligst skriv inn PIN-koden i feltet under</p>
                        <label htmlFor="pin" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"center"}}
                        >PIN: <input id="pin" value={pin} required maxLength={4} inputMode="numeric"  autoComplete="one-time-code" type="text" name="pin" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue)){
                        sPIN(newValue);
                    }
                    if(newValue.length === 4){
                        sVisLaster(true);
                        validerPIN(newValue);
                    }
                }}></input>
                {visIkkeGodkjent && <p>Feil pin... Ikke mottatt pin? Sjekk om telefonnummeret er skrevet riktig</p>} 
                {visLaster && <div className='laster'></div>} 
                </label>
                    </div>
                ):""}
                <div ref={scrollPINBoks}></div>
                
                

            {isMobile?(<div className='infoboks'>
                <div>
                <h3>Din timebestilling</h3>
                <div>Dato {(dato != null?(<p>{parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</p>):"")}</div>
                <div>Medarbeider {(frisor === false?(<p>Første ledige medarbeider</p>):(frisor != null?(<p>{frisor.navn}</p>):""))}</div>
                <div>Time for {(produkt.length > 0?(<p>{produkt.map(produkt=>produkt.navn).join(", ")}</p>):"")}</div>
                <div>Klokkeslett {(klokkeslettet != null && produkt.length > 0?(<p>{klokkeslettet}</p>):"")}</div>
                <div>Estimert pris {totalPris} kr</div>
                <div>Estimert tid {totalTid} minutter</div>
                </div>
                <p>Obs.: Alle priser er fra-priser</p>
                </div>):""
            }

                <p>Denne siden bruker informasjonskapsler. Ønsker du å lese mer om vår bruk av cookies, kan du lese mer <a aria-label="Åpne personvernserklæringen og brukervilkår i ny fane" rel='noreferrer' target="_blank" href='/personvaernserklaering-og-brukervilkaar'>her</a></p>
                <p>Jeg godtar <a aria-label="Åpne personvernserklæringen og brukervilkår i ny fane" rel='noreferrer' target="_blank" href='/personvaernserklaering-og-brukervilkaar'>personvernserkæringen, brukervilkår og bruk av cookies</a> ved å trykke "send inn reservasjon"</p>
                
                <label style={{display:"flex", justifyContent:"center", flexDirection:"column"}} htmlFor='sms_bekreftelse'>
                    <div style={{display:"flex", alignItems:"center", flexDirection:"row"}}>Få bekreftelse på SMS? <input style={{height:"1.4rem", width:"1.4rem"}} required aria-required id="sms_bekreftelse" type='checkbox' checked={smsBekreftelse} onChange={()=>{
                        
                        sSmsBekreftelse(!smsBekreftelse);
                    }} onKeyDown={(e)=>{
                        if(e.code === "Enter" || e.code === "Space"){
                            e.preventDefault();
                            sSmsBekreftelse(!e.target.checked);
                        }
                    }}></input><div className='litentekst'> Gratis</div> 
                    </div>
                    {new Date(dato) > new Date(nesteDag())? <div className='litentekst'>Påminnelse på SMS kommer dagen før timen, og kommer i tillegg (uansett).</div>:""} 
                </label>

                {(harregistrert?"Laster...":(<button disabled={!validertSMSpin} style={{padding:"1rem", color:"var(--color2)", backgroundColor:"var(--farge2)"}} onClick={()=>{
                    
                    if(telefonnummer.length === 8 && navn !== ""){
                        sHarRegistrert(true);
                        registrerData();
                    } else {
                        alert("Telefonnumeret eller navn er ikke gyldig");
                    }
                }} onKeyDown={(e)=>{
                    if(e.code === "Enter" || e.code === "Space"){
                        
                        if(telefonnummer.length === 8 && navn !== ""){
                            sHarRegistrert(true);
                            registrerData();
                        } else {
                            alert("Telefonnumeret eller navn er ikke gyldig");
                        }
                    }
                }}>SEND INN RESERVASJON</button>))}
                {!validertSMSpin && <p>Fyll inn navn og telefonnumer, og verifiser telefonnumer dersom det ikke er gjort.</p>}
                <div  ref={sendReservasjonBoks}></div>
            </form>
        </div>
    )
}


function nesteDag(d = new Date()){
    let currentTime = d.getTime();
  
    // add 1 day worth of milliseconds (1000ms * 60s * 60m * 24h)
    let oneDay = 1000 * 60 * 60 * 24;
    let newTime = currentTime + oneDay;
  
    // create a new Date object using the new date in milliseconds
    let newDate = new Date(newTime);
    return hentDato(newDate);
}
  
function hentDato(d = new Date()){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return (`${year}-${month}-${day}`);
  
}

export default React.memo(PersonInfo);