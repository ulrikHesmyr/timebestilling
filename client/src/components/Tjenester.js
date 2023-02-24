import React, {useState} from "react";
import Fortsett from "./Fortsett.js";


function Tjenester({env, sFrisor, sKlokkeslett, displayKomponent, produkt, sProdukt}){
    
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);
    return(
        <div className='animer-inn'>
            <div className="kategorier">
            Les mer om våre behandlinger på startsiden
                {env.kategorier.map((kategori, index)=>(
                    <div   key={kategori} style={{transition:"0.2s ease all", border:"thin solid black", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 id={kategori}  role="button" aria-controls={`${kategori}tjenestene`} aria-label={`Vis behandlingene for kategorien: ${kategori}`} aria-expanded={kategoriSynlig[env.kategorier.indexOf(kategori)]} className="kategori" onClick={()=>{
                            let temp = kategoriSynlig;
                            let n = env.kategorier.indexOf(kategori);
                            if(kategoriSynlig[n]){
                                temp[n] = false;
                            } else {
                                temp[n] = true;
                            }
                            setKategoriSynlig(temp);
                            sK(!K);
                        }}>{kategori} <img className={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?"rotert":""} alt={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?`Innhold for kategorien ${kategori} vises`:`innhold for kategorien ${kategori} vises ikke`)} style={{height:"1.9rem", transition:"0.5s ease all"}} src="lukket.png"></img> </h3>
                        <div role="region" aria-labelledby={kategori} aria-hidden={!kategoriSynlig[env.kategorier.indexOf(kategori)]} className="tjenestene" id={`${kategori}tjenestene`} style={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?{overflow:"visible", opacity:"1"}:{height:"0.1rem", overflow:"hidden", opacity:"0", transform:"translateY(-20px)"}}>
                            {env.tjenester.filter(element=>element.kategori === kategori).map((tjeneste)=>(

                                <div role="button" aria-label={`Velg behandlingen: ${tjeneste.navn}`} className={`tjeneste`} key={tjeneste.navn} onClick={()=>{
                                    if(!produkt.includes(tjeneste)){
                                        sProdukt([...produkt, tjeneste]);
                                        sKlokkeslett(null);
                                        sFrisor(null);
                                        console.log([...produkt, tjeneste], "produkt");
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
                        </div>
                    </div>
                    
                    
                    ))}
            </div>
                    <Fortsett displayKomponent={displayKomponent} number={1} disabled={(produkt.length > 0?false:true)} />
        </div>
    )
}

export default React.memo(Tjenester);