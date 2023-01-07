import React from 'react'
import Fortsett from './Fortsett';
import { hentDato } from '../App';

function Dato({dato, synligKomponent, displayKomponent, sDato, sKlokkeslett, sProdukt, klokkeslettet, produkt}){
    return(
        <div className={synligKomponent === 0? 'animer-inn':'animer-ut'}>
            <input value={dato} type="date" min={hentDato()} onChange={(e)=>{
                if(produkt.length > 0 || klokkeslettet != null){
                    sProdukt([]);
                    sKlokkeslett(null);
                }
                sDato(e.target.value);
            }}></input>
            <Fortsett valid={(dato !== null? false:true)} number={1} displayKomponent={displayKomponent} />
        </div>
    )
}

export default React.memo(Dato);