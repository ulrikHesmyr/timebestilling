import React, {useState} from 'react'

function PersonInfo({env, totalTid, totalPris, dato, klokkeslettet, produkt, frisor, hentMaaned, isMobile, synligKomponent, displayKomponent, navn, telefonnummer, nullstillData, setReservasjon ,setUpdate ,updateDataTrigger, data, sNavn, sTelefonnummer}){
    
    const [harregistrert, sHarRegistrert] = useState(false); //For å passe på at en bruker ikke trykker to ganger før neste side rekker å laste inn
    const [validertSMSpin, sValidertSMSpin] = useState(!env.aktivertSMSpin); 
    const [visPINBoks, sVisPINBoks] = useState(false);
    const [pin, sPIN] = useState('');
    const [visIkkeGodkjent, sVisIkkeGodkjent] = useState(false);
    const aktivertSMSpin = env.aktivertSMSpin;
    
    let format = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~]/;

    async function validerPIN(p){
        const request = await fetch('/timebestilling/tlfpin', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({pin:p}),
            //credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        }
        if(response.valid){
            sValidertSMSpin(true);
            visIkkeGodkjent(false);
        } else {
            sValidertSMSpin(false);
            sVisIkkeGodkjent(true);
        }
    }
    async function validerSMSpin(){
        const request = await fetch('/timebestilling/SMSpin', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({tlf:telefonnummer}),
            //credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        } else if(response.valid){
            sValidertSMSpin(true);
        } else if(!response.valid) {
            sVisPINBoks(true);
        }
    }
    async function registrerData(){
        const request = await fetch('/timebestilling/bestilltime', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
            //credentials: 'include'
        });
        const response = await request.json();
        if(response.m){
            alert(response.m);
        } else if(response.bestillingAlreadyExcist){
            alert("Denne timen er opptatt, noen har bestilt time samtidig som deg, men sendte inn registrering først, prøv på nytt!");
            sHarRegistrert(false);
        } else if(response){
            setUpdate(!updateDataTrigger);
            setReservasjon(response.bestiltTime);
            nullstillData();
            displayKomponent(0);
        } else {
            alert("Noe har skjedd galt, prøv på nytt om litt!");
        }
    }

    return (
        <div className={synligKomponent === 4? 'animer-inn':''}>
            <form>
                <label htmlFor="navn">Navn: * <input required maxLength={20} value={navn} type="text" placeholder='Navn Navnesen' name='navn' onChange={(e)=>{
                    if(!format.test(e.target.value)){ //Legg inn regex
                        sNavn(e.target.value);
                    }
                }}></input> </label>

                <label htmlFor="telefonnummer">Telefon: * <input required maxLength={8} inputMode="numeric" value={telefonnummer} type="text" name="telefonnummer" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue) && (e.target.value.length === 0 || e.target.value[0] === "4" || e.target.value[0] === "9")){
                        sTelefonnummer(newValue);
                    } 
                }}></input> 
                {!visPINBoks && !validertSMSpin?<button onClick={(e)=>{
                    e.preventDefault();
                    if(telefonnummer.length === 8){
                        validerSMSpin();
                    } else {
                        alert("Telefonnummeret må være 8 siffer langt");
                    }
                }}>OK</button>:""}</label>

                {visPINBoks?(
                    <div>
                        <p>Vi har sendt deg en SMS med en PIN-kode, vennligst skriv inn PIN-koden i feltet under</p>
                        <label htmlFor="pin" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"center"}}
                        >PIN: <input value={pin} required maxLength={4} inputMode="numeric"  autoComplete="one-time-code" type="text" name="pin" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue)){
                        sPIN(newValue);
                    }
                    if(newValue.length === 4){
                        validerPIN(newValue);
                    }
                }}></input>{visIkkeGodkjent && <p>Feil pin... Ikke mottatt pin? Sjekk om telefonnummeret er skrevet riktig</p>} </label>
                    </div>
                ):""}
                

            {isMobile?(<div className='infoboks'>
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
                </div>):""
            }

                <p>Bekreftelse på din reservasjon sendes på SMS</p>
                <p>Jeg godkjenner <a rel='noreferrer' target="_blank" href='/personvaernserklaering-og-brukervilkaar'>personvernserkæringen og brukervilkår</a> ved å trykke "send inn reservasjon"</p>
                {(harregistrert?"Laster...":(<button disabled={!validertSMSpin} style={{padding:"1rem", color:"var(--color2)", backgroundColor:"var(--farge2)"}} onClick={(e)=>{
                    e.preventDefault();
                    if(telefonnummer.length === 8 && navn !== ""){
                        sHarRegistrert(true);
                        registrerData();
                    } else {
                        alert("Telefonnumeret eller navn er ikke gyldig");
                    }
                }}>SEND INN RESERVASJON</button>))}
            </form>
        </div>
    )
}

export default React.memo(PersonInfo);