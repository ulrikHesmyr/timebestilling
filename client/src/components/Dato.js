import React, {useRef} from 'react';
import { hentDato } from '../App'

function Dato({datoForsteLedige, dato, sDato, sKlokkeslett, klokkeslettet, hentMaaned}){

    const ukedag = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const velgKlokkeslettBoks = useRef(null);
    return(
        <div className='animer-inn velgDatoBoks'>
            <label>
                <h4>Velg dato her:</h4> 
            <input value={dato} type="date" min={hentDato()} onChange={(e)=>{
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }
                sDato(e.target.value);
                velgKlokkeslettBoks.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }}></input>
                {datoForsteLedige !== null?(<div>Første ledige time: {ukedag[new Date(datoForsteLedige).getDay()]} {parseInt(datoForsteLedige.substring(8,10))}. {hentMaaned(parseInt(datoForsteLedige.substring(5,7)) -1)}</div>) :""}
                <div ref={velgKlokkeslettBoks}></div>
                <div>Valgt dato: <strong>{ukedag[new Date(dato).getDay()]} {parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</strong></div>
            </label>
        </div>
    )
}

export default React.memo(Dato);