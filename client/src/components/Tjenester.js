import React, {useState} from "react";
import Fortsett from "./Fortsett.js";


function Tjenester({env, sFrisor, sKlokkeslett, displayKomponent, produkt, sProdukt}){
    
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);
    return(
        <div className='animer-inn'>
            <div className="kategorier">
            
                {env.kategorier.map((kategori, index)=>(
                    <div key={kategori} style={{transition:"0.2s ease all", border:"thin solid black", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 className="kategori" onClick={()=>{
                            let temp = kategoriSynlig;
                            let n = env.kategorier.indexOf(kategori);
                            if(kategoriSynlig[n]){
                                temp[n] = false;
                            } else {
                                temp[n] = true;
                            }
                            setKategoriSynlig(temp);
                            sK(!K);
                        }}>{kategori} <img alt={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?`Innhold for kategorien ${kategori} vises`:`innhold for kategorien ${kategori} vises ikke`)} style={{height:"1.9rem"}} src={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?"aapnet.png":"lukket.png")}></img> </h3>
                        {(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?(<div className="tjenestene">
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
                                        <h4>{tjeneste.navn}</h4>
                                        <p>Pris: {tjeneste.pris} kr</p>
                                        <p>Tid: {tjeneste.tid} minutter</p>
                                    </div>
                                    <input type="checkbox" readOnly checked={produkt.includes(tjeneste)}></input>
                                </div>
                                )
                            )}
                        </div>):"")}
                    </div>
                    
                    
                    ))}
            </div>
                    <Fortsett displayKomponent={displayKomponent} number={1} disabled={(produkt.length > 0?false:true)} />
        </div>
    )
}

export default React.memo(Tjenester);