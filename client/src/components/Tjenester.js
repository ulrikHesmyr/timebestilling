import React, {useState, useRef} from "react";
import Fortsett from "./Fortsett.js";
import { Link } from "react-router-dom";


function Tjenester({env, sDatoForsteLedige, antallBehandlinger, sAntallBehandlinger, sFrisor, sKlokkeslett, displayKomponent, produkt, sProdukt}){
    
    const valgtBehandlingScroll = useRef(null);
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);
    
    return(
        <div className='animer-inn'>
            <div className="kategorier">
            <Link style={{display:"flex", flexDirection:"row", alignItems:"center", flexWrap:"wrap"}} to="/"><img alt="Info-ikon" src="infoHjem.png" className="ikonKnapper"></img> Les mer om våre behandlinger på startsiden</Link>
                {env.kategorier.map((kategori, index)=>(
                    <div   key={kategori} style={{transition:"0.2s ease all", border:"thin solid black", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 tabIndex={0} id={kategori}  role="button" aria-controls={`${kategori}tjenestene`} aria-label={`Vis behandlingene for kategorien: ${kategori}`} aria-expanded={kategoriSynlig[env.kategorier.indexOf(kategori)]} className="kategori" onClick={()=>{
                            let temp = kategoriSynlig;
                            let n = env.kategorier.indexOf(kategori);
                            if(kategoriSynlig[n]){
                                temp[n] = false;
                            } else {
                                temp[n] = true;
                            }
                            setKategoriSynlig(temp);
                            sK(!K);
                        }} onKeyDown={(e)=>{
                            if(e.code === "Enter" || e.code === "Space"){
                                let temp = kategoriSynlig;
                                let n = env.kategorier.indexOf(kategori);
                                if(kategoriSynlig[n]){
                                    temp[n] = false;
                                } else {
                                    temp[n] = true;
                                }
                                setKategoriSynlig(temp);
                                sK(!K);
                            }   
                        }}><div style={{display:"flex", flexDirection:"row"}}>{kategori} {antallBehandlinger[index] > 0? <p style={{background:"var(--background1)", borderRadius:"50%", aspectRatio:"1/1", height:"75%", display:"flex", alignItems:"center", justifyContent:"center"}}>{antallBehandlinger[index] > 0? antallBehandlinger[index]:"" }</p>:""}</div><img className={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?"rotert":""} alt={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?`Innhold for kategorien ${kategori} vises`:`innhold for kategorien ${kategori} vises ikke`)} style={{height:"1.9rem", transition:"0.5s ease all"}} src="lukket.png"></img> </h3>
                        <div role="region" aria-labelledby={kategori} aria-hidden={!kategoriSynlig[env.kategorier.indexOf(kategori)]} className="tjenestene" id={`${kategori}tjenestene`} style={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?{overflow:"visible", opacity:"1"}:{height:"0.01rem", overflow:"hidden", opacity:"0", transform:"translateY(-10px)", margin:"0 !important"}}>
                            {env.tjenester.filter(element=>element.kategori === kategori).map((tjeneste)=>(

                                <div role="button" aria-label={`Velg behandlingen: ${tjeneste.navn}`} className={`tjeneste`} key={tjeneste.navn} onClick={()=>{
                                    if(!produkt.includes(tjeneste)){
                                        sProdukt([...produkt, tjeneste]);
                                        sKlokkeslett(null);
                                        sFrisor(null);
                                        sDatoForsteLedige(null);
                                        antallBehandlinger[index]++;
                                        sAntallBehandlinger(antallBehandlinger);
                                        valgtBehandlingScroll.current.scrollIntoView({behavior:"smooth", block:"center"});
                                    } else {
                                        sProdukt(produkt.filter(p=>p !== tjeneste));
                                        antallBehandlinger[index]--;
                                        sAntallBehandlinger(antallBehandlinger);
                                    }
                                }} onKeyDown={(e)=>{
                                    
                                    if(e.code === "Enter" || e.code === "Space"){
                                        if(!produkt.includes(tjeneste)){
                                            sProdukt([...produkt, tjeneste]);
                                            sKlokkeslett(null);
                                            sFrisor(null);
                                            sDatoForsteLedige(null);
                                            antallBehandlinger[index]++;
                                            sAntallBehandlinger(antallBehandlinger);
                                            valgtBehandlingScroll.current.scrollIntoView({behavior:"smooth", block:"center"});
                                        } else {
                                            sProdukt(produkt.filter(p=>p !== tjeneste));
                                            antallBehandlinger[index]--;
                                            sAntallBehandlinger(antallBehandlinger);
                                        }
                                    }
                                }}>
                                    <div>
                                        <h4>{tjeneste.navn}</h4>
                                        <p>Pris: {tjeneste.pris} kr</p>
                                        <p>Tid: {tjeneste.tid} minutter</p>
                                    </div>
                                    <input tabIndex={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true? 0:-1)} aria-label={`Velg behandlingen: ${tjeneste.navn}`} type="checkbox" readOnly checked={produkt.includes(tjeneste)}></input>
                                </div>
                                )
                            )}
                        </div>
                    </div>
                    
                    
                    ))}
            </div>
            <div ref={valgtBehandlingScroll}></div>
                    <Fortsett displayKomponent={displayKomponent} previous={0} number={1} disabled={(produkt.length > 0?false:true)} />
        </div>
    )
}

export default React.memo(Tjenester);