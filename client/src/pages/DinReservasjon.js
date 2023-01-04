import React, {useContext} from 'react'
import { DataContext } from '../App';

export default function DinReservasjon({env, hentMaaned, setReservasjon ,registrertReservasjon}){
    
    //const env = useContext(DataContext);

    const gjeldendeTjenester = env.tjenester.filter(element=>registrertReservasjon.behandlinger.includes(element.navn));
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);
    return (
        (registrertReservasjon?
            <div className='reservasjon'>
                <h1>Vi har mottat din reservasjon!</h1>
                {(registrertReservasjon?(<div> 
                    <p>Din time er {parseInt(registrertReservasjon.dato.substring(8,10))}. {hentMaaned(parseInt(registrertReservasjon.dato.substring(5,7)) -1)} klokken {registrertReservasjon.tidspunkt}</p>
                    <p>hos vår medarbeider: {registrertReservasjon.medarbeider}</p>
                    <p>Time for: {registrertReservasjon.behandlinger.join(", ")}</p>
                    <p>Din time er registrert på {registrertReservasjon.kunde}, tlf.: {registrertReservasjon.telefonnummer}</p>
                    <p></p>
                    <div>Estimert pris {totalPris} kr</div>
                    <div>Estimert tid {totalTid} minutter</div>
                </div>):"")}
                <button onClick={(e)=>{
                    e.preventDefault();
                    setReservasjon(undefined);
                }}>GÅ TILBAKE</button>
            </div>:<p>Laster inn...</p>)
    )
}