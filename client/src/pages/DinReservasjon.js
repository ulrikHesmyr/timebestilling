import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function DinReservasjon({env, hentMaaned, registrertReservasjon, setReservasjon}){
    
    const gjeldendeTjenester = env.tjenester.filter(element=>registrertReservasjon.behandlinger.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);

    const [frisorBilde, sFrisorBilde] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{
        //Lager et array med base64 bilder
        async function hentBilder(){
            let gjeldendeFrisor = env.frisorer.find(f=>f.navn === registrertReservasjon.medarbeider);
            const imgBlob = await fetch("/uploads/" + gjeldendeFrisor.img)
            .then(r => r.blob());
      
          const imgBlobUrl = URL.createObjectURL(imgBlob);
            sFrisorBilde(imgBlobUrl);
        }
        hentBilder();
    }, [registrertReservasjon, env.frisorer])
    
    return (
        (registrertReservasjon?
            <div className='reservasjon'>
                <h1>Vi har mottatt din reservasjon!</h1>
                {registrertReservasjon?<div> 
                    <div className='tekstkomponent'><img src="klokke.png" alt="Bilde av klokkeikon"></img>Din time er {parseInt(registrertReservasjon.dato.substring(8,10))}. {hentMaaned(parseInt(registrertReservasjon.dato.substring(5,7)) -1)} klokken {registrertReservasjon.tidspunkt}</div>
                    
                    <div>Time for: {registrertReservasjon.behandlinger.join(", ")}</div>
                    <div>Din time er registrert på {registrertReservasjon.kunde}, tlf.: {registrertReservasjon.telefonnummer}</div>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>Din medarbeider for timen: {registrertReservasjon.medarbeider}<img alt="Bilde av medarbeider" src={frisorBilde} style={{height:"5rem", margin:"1rem"}}></img></div>
                    <div>Estimert pris {totalPris} kr</div>
                    <div>Estimert tid {totalTid} minutter</div>
                    <br></br>
                    <div className='tekstkomponent'> <img src="sted.png" alt='Bilde av lokasjonsikon'></img> {env.adresse.gatenavn} {env.adresse.husnummer}{env.adresse.bokstav}, {env.adresse.postnummer} {env.adresse.poststed}</div>
                    <br></br>
                    <div className='tekstkomponent' ><img src="smil.png" alt="Bilde av smilefjesikon"></img>Vi sees!</div>
                </div>:""}
                <div className='tekstkomponent'>
                    <button aria-label="Din reservasjon er mottatt. Du vil få bekreftelse på SMS dersom du krysset av for det. Trykk her for å gå til hjemsiden. Vi sees!" style={{padding:"1rem"}} onClick={(e)=>{
                    e.preventDefault();

                    navigate("/");
                    setReservasjon(undefined);
                    }}>GÅ TILBAKE</button><img tabIndex={0} style={{cursor:"pointer"}} src="skrivut.png" alt="Skriv ut bekreftelsen" aria-label='Skriv ut bekreftelsen' onClick={(e)=>{
                        e.preventDefault();
                        window.print();
                    }} onKeyDown={(e)=>{
                        if(e.code === "Enter" || e.code === "Space"){
                            window.print();
                        }
                    }}></img>
                </div>
            </div>:<p>Laster inn...</p>)
    )
}

export default React.memo(DinReservasjon);