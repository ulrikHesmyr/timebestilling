import React from 'react'
import {tjenester } from '../shared/env'

export default function DinReservasjon({hentMaaned, setReservasjon ,registrertReservasjon}){
    const gjeldendeTjenester = tjenester.filter(element=>registrertReservasjon.behandlinger.includes(element.navn));
    console.log(gjeldendeTjenester);
    const totalTid = gjeldendeTjenester.reduce((total, element)=> total + element.tid, 0);
    const totalPris = gjeldendeTjenester.reduce((total, element)=> total + element.pris, 0);
    return (
        <div className='reservasjon'>
            <h1>Vi har mottat din reservasjon!</h1>
            {(registrertReservasjon?(<div> 
                <p>Din time er {parseInt(registrertReservasjon.dato.substring(8,10))}. {hentMaaned(parseInt(registrertReservasjon.dato.substring(5,7)) -1)} klokken {registrertReservasjon.tidspunkt}</p>
                <p>hos vår medarbeider: {registrertReservasjon.medarbeider}</p>
                <p>Time for: {registrertReservasjon.behandlinger.join(", ")}</p>
                <p>Din time er registrert på {registrertReservasjon.kunde}, tlf.: {registrertReservasjon.telefonnummer}</p>
                <p></p>
                <p>Total tid {totalTid} minutter</p>
                <p>Total pris {totalPris} NOK</p>
            </div>):"")}
            <button onClick={(e)=>{
                e.preventDefault();
                setReservasjon(undefined);
            }}>GÅ TILBAKE</button>
        </div>
    )
}