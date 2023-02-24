import React, {useState, useEffect} from 'react'

function DinReservasjon({env, hentMaaned, registrertReservasjon}){
    
    const gjeldendeTjenester = env.tjenester.filter(element=>registrertReservasjon.behandlinger.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);

    const [frisorBilde, sFrisorBilde] = useState(null);
    useEffect(()=>{
        //Lager et array med base64 bilder
        async function hentBilder(){
            let gjeldendeFrisor = env.frisorer.find(f=>f.navn === registrertReservasjon.medarbeider);
            const array = new Uint8Array(gjeldendeFrisor.img.data.data);
            const base = window.btoa(String.fromCharCode.apply(null, array));
            const base64Image = `data:${gjeldendeFrisor.img.contentType};base64,${base}`;
            
            sFrisorBilde(base64Image);
        }
        hentBilder();
    }, [registrertReservasjon, env.frisorer])
    
    return (
        (registrertReservasjon?
            <div className='reservasjon'>
                <h1>Vi har mottatt din reservasjon!</h1>
                {(registrertReservasjon?(<div> 
                    <p>Din time er {parseInt(registrertReservasjon.dato.substring(8,10))}. {hentMaaned(parseInt(registrertReservasjon.dato.substring(5,7)) -1)} klokken {registrertReservasjon.tidspunkt}</p>
                    
                    <p>Time for: {registrertReservasjon.behandlinger.join(", ")}</p>
                    <p>Din time er registrert på {registrertReservasjon.kunde}, tlf.: {registrertReservasjon.telefonnummer}</p>
                    <p style={{display:"flex", flexDirection:"row", alignItems:"center"}}>Din medarbeider for timen: {registrertReservasjon.medarbeider}<img alt="Bilde av frisør" src={frisorBilde} style={{height:"5rem", margin:"1rem"}}></img></p>
                    <div>Estimert pris {totalPris} kr</div>
                    <div>Estimert tid {totalTid} minutter</div>
                    <p></p>
                    <li>{env.adresse.gatenavn} {env.adresse.husnummer}{env.adresse.bokstav}, {env.adresse.postnummer} {env.adresse.poststed}</li>
                    <p>Bekreftelse er sendt på SMS</p>
                    <div>Vi gleder oss til å se deg!</div>
                </div>):"")}
                <button style={{padding:"1rem"}} onClick={(e)=>{
                    e.preventDefault();
                    window.location.href="/";
                }}>GÅ TILBAKE</button>
            </div>:<p>Laster inn...</p>)
    )
}

export default React.memo(DinReservasjon);