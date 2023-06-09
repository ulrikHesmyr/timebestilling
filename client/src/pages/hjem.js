import React, {useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
import Footer from '../components/Footer'


/*
 <video autoplay muted loop id="myVideo">
                <source src="startside.mp4" type="video/mp4"></source>
                Your browser does not support HTML5 video.
                </video>
 */
function Hjem({env}){

    const aapningstider = useRef(null);

    //Bildene til de ansatte
    const [frisorBildeArray, sFrisorBildeArray] = useState(null);

    //Deltajer ansatte
    const [visDetaljerFrisor, sVisDetaljerFrisor] = useState(false);
    const [detaljerFrisor, sDetaljerFrisor] = useState(null);
    
    //Behandlinger
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);

    

    return(<div style={{position:"relative"}}>
        <div className="hjem">
            <header>
                <div className="bedriftNavnHeader"> <div className="viEr" >Vi er </div>{env.bedrift}</div>
                <div>
                    {env.aktivertTimebestilling ? <>
                        <p className="bestilleTimeplz">Ønsker du å bestille time hos oss?</p>
                    <Link to="/timebestilling" className='navBarBestillTime' tabIndex={0}><div style={{textShadow:"1px 1px 3px black"}}>Bestill time</div></Link></>:
                    <>
                        <p  className="bestilleTimeplz">Bestill time på telefon:</p>
                        <div className='navBarBestillTime'>
                            <a href={`tel:+47 ${env.kontakt_tlf}`} >{env.kontakt_tlf}</a>
                        </div>
                    </>}
                </div>
            </header>

        </div>
        <div className="startContainer">
        <div style={{padding:"2rem"}}>
                <h1>Velkommen!</h1>
                <p className="storbokstav" style={{fontSize:"larger"}}>{env.omOssArtikkel}</p>
            </div>
        <div className="startside">
            
            <div ref={aapningstider} className="hjemsideSeksjon">
                <div className="overskriftContainer">
                    <hr></hr>
                    <div className="h2Container">
                        <h2>Åpningstider</h2>
                    </div>
                </div>
                <div>
                     {env.klokkeslett.map((tid, index)=>(
                         <div key={tid.dag} style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly", fontWeight:(new Date().getDay() === index? "bold":"400")}}>
                             <p>{tid.dag}:</p> <p>{tid.stengt?"Stengt":`${tid.open} - ${tid.closed}`}</p>
                         </div>
                     ))}
                </div>
            </div>
            <div className="hjemsideSeksjon">
            <div className="overskriftContainer">
                    <hr></hr>
                    <div className="h2Container">
                        <h2>Våre medarbeidere</h2>
                    </div>
                </div>
                <div className="frisorene">
                    {env.frisorer.map((frisor, index)=>(
                    <div id={frisor.navn} 
                    aria-expanded={visDetaljerFrisor && detaljerFrisor !== null}
                     aria-label={`Vis detaljer om ansatt: ${frisor.navn}`}
                      key={frisor.navn} className="frisorHjem" onClick={()=>{
                        sDetaljerFrisor(index);
                        sVisDetaljerFrisor(true);
                    }} onKeyDown={(e)=>{
                        if(e.code === "Enter" || e.code === "Space"){
                            sDetaljerFrisor(index);
                            sVisDetaljerFrisor(true);
                        }
                    }}>
                            <h4 style={{margin:"0.3rem", width:"max-content"}}>{frisor.navn}</h4>
                            <img className="velgmedarbeider" src={`${window.origin}/uploads/${env.frisorer[index].img}`} alt={`Bilde av ansatt ${frisor.navn}`}></img>
                        <div className="row">
                            <p style={{margin:"0.1rem"}}>{frisor.tittel}</p>
                            <div className="infoFrisorKnapp" ></div>
                        </div>
                        </div>
                    ))}
                    {visDetaljerFrisor && detaljerFrisor !== null?
                    <>
                        <div role="region" aria-hidden={!visDetaljerFrisor && detaljerFrisor == null} className="fokus detaljerFrisor">
                            <div tabIndex={0} aria-label="Lukk detaljer om ansatt" className="lukk" onClick={()=>{
                                sVisDetaljerFrisor(false);
                                sDetaljerFrisor(null);
                            }} onKeyDown={(e)=>{
                                if(e.code === "Enter" || e.code === "Space"){
                                    sVisDetaljerFrisor(false);
                                    sDetaljerFrisor(null);
                                }
                            }}>
                            </div>
                            <h3>Våre medarbeidere</h3>
                            <p>Bli kjent med våre medarbeidere og gjerne les litt om de nedenfor!</p>
                            <div className="rotasjonSirkler">
                                {env.frisorer.map((f, index)=>{
                                    return <div key={index} className={index === detaljerFrisor?"rotasjonSirkel aktivSirkel":"rotasjonSirkel"}></div>
                                })}
                                
                            </div>
                            <div className="bildeRotasjon">
                                <div className="row">
                                    <button onClick={()=>{
                                        if(detaljerFrisor > 0){
                                            sDetaljerFrisor(detaljerFrisor-1);
                                        } else {
                                            sDetaljerFrisor(env.frisorer.length-1);
                                        }
                                    }} className="venstre"></button>
                                    <button onClick={()=>{
                                        if(detaljerFrisor > env.frisorer.length-2){
                                            sDetaljerFrisor(0);
                                        } else {
                                            sDetaljerFrisor(detaljerFrisor+1);
                                        }
                                    }} className="hoyre"></button>
                                </div>
                               <div className="bildeRotasjonBilder">
                                    {env.frisorer.map((f, index)=>
                                        <div key={index} className="column">
                                            <img key={index} className={index === detaljerFrisor?"frisorbilde bildeDisplayImg":"frisorbilde bildeNoneDisplayImg"} src={frisorBildeArray[index]} alt={`Bilde av ansatt ${env.frisorer[index].navn}`} ></img>
                                        </div>
                                    )}
                                </div>
                                    <div>
                                        <h3 style={{margin:"0"}}>{env.frisorer[detaljerFrisor].navn}</h3>
                                        {env.frisorer[detaljerFrisor].tittel}
                                    </div>
                                    <p>{env.frisorer[detaljerFrisor].beskrivelse}</p>
                                    
                               
                            </div>
                                
                        </div>
                    </>:<></>}
                </div>
            </div>
            
        </div>

        <div className="startside">
            
            <div className="hjemsideSeksjon">
            <div className="overskriftContainer">
                    <hr></hr>
                    <div className="h2Container">
                        <h2>Hvor du finner oss</h2>
                    </div>
                </div>
                <div>
                    
                    <div tabIndex={0} aria-label={`Adressen er: ${env.adresse.gatenavn} ${env.adresse.husnummer}${env.adresse.bokstav}, ${env.adresse.postnummer} ${env.adresse.poststed}.Trykk her for å vise lokasjonen til salongen i kart`} onClick={()=>{
                        window.open(`https://www.google.com/maps/place/${env.adresse.gatenavn.replace(/ /g, "+")}+${env.adresse.husnummer}${env.adresse.bokstav},+${env.adresse.postnummer}+${env.adresse.poststed}/@${env.adresse.rep.lat},${env.adresse.rep.lng}`);
                    }} onKeyDown={(e)=>{
                        if(e.code === "Enter" || e.code === "Space"){
                            window.open(`https://www.google.com/maps/place/${env.adresse.gatenavn.replace(/ /g, "+")}+${env.adresse.husnummer}${env.adresse.bokstav},+${env.adresse.postnummer}+${env.adresse.poststed}/@${env.adresse.rep.lat},${env.adresse.rep.lng}`);
                        }
                    }} className="adresseLink"><div className="adresseBlur"><p>{env.adresse.gatenavn} {env.adresse.husnummer}{env.adresse.bokstav}, {env.adresse.postnummer} {env.adresse.poststed}</p><div>GÅ TIL KART</div></div></div>
                
                </div>
            </div>
            
            <div className="hjemsideSeksjon">
            <div className="overskriftContainer">
                    <hr></hr>
                    <div className="h2Container">
                        <h2>Våre behandlinger</h2>
                    </div>
                </div>
                <div className="behandlingerHjemsiden">
                {env.kategorier.map((kategori, index)=>(
                    <div  key={kategori} style={{cursor:"pointer", transition:"0.2s ease all", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 tabIndex={0} role="button" aria-label={`Vis behandlingene for kategorien ${kategori}`} aria-expanded={kategoriSynlig[index]} aria-controls={`${kategori}tjeneste`} id={kategori} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottom:"thin solid rgba(0,0,0,0.3)"}} onClick={()=>{
                            let temp = kategoriSynlig;
                            let n = env.kategorier.indexOf(kategori);
                            if(kategoriSynlig[n]){
                                temp[n] = false;
                            } else {
                                temp[n] = true;
                            }
                            setKategoriSynlig(temp);
                            sK(!K);
                        }}
                        onKeyDown={(e)=>{
                            if(e.code === "Enter"){
                                
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
                        }}>{kategori} <img className={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?"rotert":"")} aria-label={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?`Innhold for kategorien ${kategori} vises`:`innhold for kategorien ${kategori} vises ikke`)} style={{height:"1.9rem", transition:"0.5s ease all"}} src="lukket.png"></img> </h3>
                        <ul aria-hidden={!(kategoriSynlig[index])} role="region" id={`${kategori}tjeneste`} aria-labelledby={kategori} className="tjenestene" style={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?{ height:"auto", overflow:"visible", opacity:"1", transition:"0.3s ease 0.05s all"}:{height:"2rem", overflow:"hidden", opacity:"0", transition:"0.3s ease 0.05s all", transform:"translateY(-20px)"}}>
                            {env.tjenester.filter(element=>element.kategori === kategori).map((tjeneste)=>(
                                <li key={tjeneste.navn}>
                                    <div>
                                        <p style={{fontWeight:"500"}}>{tjeneste.navn}</p>
                                        <p style={{fontWeight:"200"}}>{tjeneste.beskrivelse}</p>
                                        <p>Pris: {tjeneste.pris} kr</p>
                                        <p>Tid: {tjeneste.tid} minutter</p>
                                    </div>
                                </li>
                                )
                            )}
                        </ul>
                        
                    </div>
                    
                    
                    
                    ))}
                </div>
            </div>
            
        </div>
        <div className="seksjon">
        <div className="overskriftContainer">
                    <hr></hr>
                    <div className="h2Container">
                        <h2>Produkter</h2>
                    </div>
                </div>
                <div className="row">
                    <p>I butikken finner du produkter fra følgende leverandører!</p>
                    <div className="row">
                        <img className="bildeFooter" src="/produkter/cutrin.png" alt="Cutrin logo"></img>
                        <img className="bildeFooter" src="/produkter/moroccanoil.png" alt="Moroccanoil logo"></img>
                        <img className="bildeFooter" src="/produkter/ref.png" alt="Ref logo"></img>
                        <img className="bildeFooter" src="/produkter/renati.png" alt="Renati logo" style={{mixBlendMode:"exclusion"}}></img>
                        <img className="bildeFooter" src="/produkter/special.png" alt="Special logo"></img>
                    </div>
                </div>
            </div>
        
        </div>
        <Footer env={env}/>
            
        </div>
    )
}

export default React.memo(Hjem)