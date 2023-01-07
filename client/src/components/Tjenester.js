import React from "react";
import Fortsett from "./Fortsett.js";


function Tjenester({env, sKlokkeslett, synligKomponent, displayKomponent, produkt, sProdukt, frisor}){
    

    return(
        <div className={synligKomponent === 2? 'animer-inn':'animer-ut'}>
            <div className="kategorier">
            
                {env.kategorier.map((kategori)=>(
                    <div key={kategori}>
                        <div className="kategori">{kategori}</div>
                        {frisor.produkter.filter(element=>env.kategorier[env.tjenester[element].kategori] === kategori).map((element)=>(
                            <div className="tjeneste" key={env.tjenester[element].navn} onClick={()=>{
                                if(!produkt.includes(env.tjenester[element].navn)){
                                    sProdukt([...produkt, env.tjenester[element].navn]);
                                    sKlokkeslett(null);
                                } else {
                                    sProdukt(produkt.filter(p=>p !== env.tjenester[element].navn))
                                }
                            }}>
                            <div>
                                <h3>{env.tjenester[element].navn}</h3>
                                <p>Pris: {env.tjenester[element].pris} kr</p>
                                <p>Tid: {env.tjenester[element].tid} minutter</p>
                            </div>
                            <input type="checkbox" readOnly checked={produkt.includes(env.tjenester[element].navn)}></input>
                            </div>
                            ))}
                    </div>
                    
                    
                    ))}
            </div>
                    <Fortsett displayKomponent={displayKomponent} number={3} valid={(produkt.length > 0?false:true)} />
        </div>
    )
}

export default React.memo(Tjenester);