import React, {useState} from 'react'
import { Link } from 'react-router-dom';

function PersonInfo({totalTid, totalPris, dato, klokkeslettet, produkt, frisor, hentMaaned, isMobile, synligKomponent, displayKomponent, navn, telefonnummer, nullstillData, setReservasjon ,setUpdate ,updateDataTrigger, data, sNavn, sTelefonnummer}){
    
    const [harregistrert, sHarRegistrert] = useState(false); //For å passe på at en bruker ikke trykker to ganger før neste side rekker å laste inn
    let format = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~]/;
    async function registrerData(){
        console.log("DATA SOM SENDES: ", data);
        const request = await fetch('http://localhost:3001/timebestilling/bestilltime', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data)
        });
        const response = await request.json();
        if(response.bestillingAlreadyExcist){
            alert("Denne timen er opptatt, noen har bestilt time samtidig som deg, men sendte inn registrering først, prøv på nytt!");
            window.location.reload();
        } else if(response){
            setUpdate(!updateDataTrigger);
            setReservasjon(response.bestiltTime);
            nullstillData();
            displayKomponent(0);
           

        } else {
            alert("Noe har skjedd galt, prøv på nytt!");
        }
    }

    return (
        <div className={synligKomponent === 4? 'animer-inn':''}>
            <form>
                <label htmlFor="navn">Navn: * <input maxLength={20} value={navn} type="text" placeholder='Navn Navnesen' name='navn' onChange={(e)=>{
                    if(!format.test(e.target.value)){ //Legg inn regex
                        sNavn(e.target.value);
                    }
                }}></input> </label>

                <label htmlFor="phone">Telefon: * <input maxLength={8} value={telefonnummer} type="text" name="phone" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue) && (e.target.value.length === 0 || e.target.value[0] === "4" || e.target.value[0] === "9")){
                        sTelefonnummer(newValue);
                    } 
                }}></input> </label>

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
                <p>Jeg godkjenner <Link to="/personvaernserklaering-og-brukervilkaar">personvernserklæring og brukervilkår</Link> ved å trykke "send inn reservasjon"</p>
                {(harregistrert?"Laster...":(<button style={{padding:"1rem", color:"var(--color2)", backgroundColor:"var(--farge2)"}} onClick={(e)=>{
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