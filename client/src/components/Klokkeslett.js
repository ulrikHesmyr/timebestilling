import React from 'react'
import { klokkeslett, frisorer } from '../shared/env'
import {bestilteTimer} from '../shared/dataFraDatabase'

export default function Klokkeslett({sKlokkeslett, dato, hentMaaned, frisor}){
//Fjerne bestilte tidspunkter fra ledige klokkeslett
    let reserverteTimer = bestilteTimer.map(element =>{
        if(element.dato === dato && element.frisor === frisorer.indexOf(frisor)){
            return element.tidspunkt
        } else {
            return undefined
        }
    }).filter(x => x)

    let ledigeTimer = klokkeslett.map(element=>element.tid).filter(tid=> !reserverteTimer.includes(tid))
    return(
        <>
        <div className='klokkeslettene'>
            {(ledigeTimer.length > 0? ledigeTimer.map((tid)=>(<div key={tid} onClick={()=>{
                sKlokkeslett(tid)
            }}> {tid} </div>)):`Ingen ledige timer for ${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`)}
        </div>
        </>
    )
}