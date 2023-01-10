import React from "react";
import Fortsett from "./Fortsett.js";


function Tjenester({env, sFrisor, sKlokkeslett, displayKomponent, produkt, sProdukt}){
    

    return(
        <div className='animer-inn'>
            <div className="kategorier">
            
                {env.kategorier.map((kategori)=>(
                    <div key={kategori}>
                        <div className="kategori">{kategori}</div>
                        {env.tjenester.filter(element=>env.kategorier[element.kategori] === kategori).map((tjeneste)=>(
                            <div className="tjeneste" key={tjeneste.navn} onClick={()=>{
                                if(!produkt.includes(tjeneste)){
                                    sProdukt([...produkt, tjeneste]);
                                    sKlokkeslett(null);
                                    sFrisor(null);
                                } else {
                                    sProdukt(produkt.filter(p=>p !== tjeneste))
                                }
                            }}>
                                <div>
                                    <h3>{tjeneste.navn}</h3>
                                    <p>Pris: {tjeneste.pris} kr</p>
                                    <p>Tid: {tjeneste.tid} minutter</p>
                                </div>
                                <input type="checkbox" readOnly checked={produkt.includes(tjeneste)}></input>
                            </div>
                            )
                        )}
                    </div>
                    
                    
                    ))}
            </div>
                    <Fortsett displayKomponent={displayKomponent} number={1} valid={(produkt.length > 0?false:true)} />
        </div>
    )
}

export default React.memo(Tjenester);