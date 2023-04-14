import React, {useRef, useState} from 'react';
import { hentDato } from '../App'

function Dato({datoForsteLedige, sMidlertidigDato, sHarEndretDatoen, midlertidigDato, dato, sDato, sKlokkeslett, klokkeslettet, hentMaaned}){

    const ukedag = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const [okKnappSynlig, sOkKnappSynlig] = useState(false);
    const velgKlokkeslettBoks = useRef(null);
    
    return(
        <div className='animer-inn velgDatoBoks'>
            <section style={{padding:"0.3rem"}}>
                <h4>Velg dato her:</h4> 
            <input value={midlertidigDato} type="date" min={hentDato()} onChange={(e)=>{
                
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }
                sMidlertidigDato(e.target.value);
                sOkKnappSynlig(true);
                sHarEndretDatoen(true);
            }} 
            ></input>
            {okKnappSynlig?<button aria-label='Bekreft dato' onClick={(e)=>{
                e.preventDefault();
                sOkKnappSynlig(false);
                sHarEndretDatoen(false);
                
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }
                if(new Date(midlertidigDato) >= new Date()){
                    sDato(midlertidigDato);
                } else {
                    sDato(hentDato());
                }
                velgKlokkeslettBoks.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

                    
            }}>OK</button>:""}
                {datoForsteLedige !== null?(<div>Første ledige time: {ukedag[new Date(datoForsteLedige).getDay()]} {parseInt(datoForsteLedige.substring(8,10))}. {hentMaaned(parseInt(datoForsteLedige.substring(5,7)) -1)}</div>) :""}
                <div ref={velgKlokkeslettBoks}></div>
                <div>Valgt dato: <strong>{ukedag[new Date(dato).getDay()]} {parseInt(dato.substring(8,10))}. {hentMaaned(parseInt(dato.substring(5,7)) -1)}</strong></div>
            </section>
        </div>
    )
}

export default React.memo(Dato);