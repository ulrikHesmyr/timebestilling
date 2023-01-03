import React from 'react'

function Dato({synligKomponent, displayKomponent, sDato, sKlokkeslett, sProdukt, klokkeslettet, produkt, hentDato}){
    return(
        <div className={synligKomponent === 0? 'animer-inn':'animer-ut'}>
            <input type="date" min={hentDato()} onChange={(e)=>{
            if(produkt.length > 0 || klokkeslettet != null){
            sProdukt([]);
            sKlokkeslett(null);
            }
            sDato(e.target.value);
            setTimeout(()=>{
                displayKomponent(1);
            },100);
            }}></input>
        </div>
    )
}

export default React.memo(Dato);