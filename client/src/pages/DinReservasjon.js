import React from 'react'
import { useNavigate } from 'react-router-dom';

function DinReservasjon({env, hentMaaned, registrertReservasjon, setReservasjon}){
    
    const gjeldendeTjenester = env.tjenester.filter(element=>registrertReservasjon.behandlinger.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);
    const navigate = useNavigate();

    return (
        (registrertReservasjon?
            <div className='reservasjon'>
                <h1>Vi har mottatt din reservasjon!</h1>
                {registrertReservasjon?<div> 
                    <div className='tekstkomponent'><img src="klokke.png" alt="Bilde av klokkeikon"></img>Din time er {parseInt(registrertReservasjon.dato.substring(8,10))}. {hentMaaned(parseInt(registrertReservasjon.dato.substring(5,7)) -1)} klokken {registrertReservasjon.tidspunkt}</div>
                    
                    <div>Time for: {registrertReservasjon.behandlinger.join(", ")}</div>
                    <div>Din time er registrert på {registrertReservasjon.kunde}, tlf.: {registrertReservasjon.telefonnummer}</div>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>Din medarbeider for timen: {registrertReservasjon.medarbeider}<img alt="Bilde av medarbeider" src={`${window.origin}/uploads/${env.frisorer.find(f=>f.navn === registrertReservasjon.medarbeider).img}`} style={{height:"5rem", margin:"1rem"}}></img></div>
                    <div>Estimert pris {totalPris} kr</div>
                    <div>Estimert tid {totalTid} minutter</div>
                    <br></br>
                    <div className='tekstkomponent'> <img src="sted.png" alt='Bilde av lokasjonsikon'></img> {env.adresse.gatenavn} {env.adresse.husnummer}{env.adresse.bokstav}, {env.adresse.postnummer} {env.adresse.poststed}</div>
                    <br></br>
                    <div className='tekstkomponent' ><img src="smil.png" alt="Bilde av smilefjesikon"></img>Vi sees!</div>
                </div>:""}
                <div className='tekstkomponent'>
                <a className='button' href={`https://${window.location.origin.split(".")[1]}.${window.location.origin.split(".")[2]}`} rel="noreferrer" >OK</a><img tabIndex={0} style={{cursor:"pointer"}} src="skrivut.png" alt="Skriv ut bekreftelsen" aria-label='Skriv ut bekreftelsen' onClick={(e)=>{
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