import React from 'react';
import { hentDato } from '../App';

function Dato({dato, sDato, sKlokkeslett, klokkeslettet}){
    return(
        <div className='animer-inn'>
            <input value={dato} type="date" min={hentDato()} onChange={(e)=>{
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }
                sDato(e.target.value);
            }}></input>
        </div>
    )
}

export default React.memo(Dato);