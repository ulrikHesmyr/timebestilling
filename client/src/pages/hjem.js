import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Footer from '../components/Footer'


/*
 <video autoplay muted loop id="myVideo">
                <source src="startside.mp4" type="video/mp4"></source>
                Your browser does not support HTML5 video.
                </video>
 */
function Hjem({env}){

    //Bildene til de ansatte
    const [frisorBildeArray, sFrisorBildeArray] = useState(null);

    //Deltajer ansatte
    const [visDetaljerFrisor, sVisDetaljerFrisor] = useState(false);
    const [detaljerFrisor, sDetaljerFrisor] = useState(null);
    
    //Behandlinger
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);

    async function hentBilder(){
            
        let midlertidigArray = [];
        for(let i = 0; i < env.frisorer.length; i++){
            const array = new Uint8Array(env.frisorer[i].img.data.data);
            const base = window.btoa(String.fromCharCode.apply(null, array));
            const base64Image = `data:${env.frisorer[i].img.contentType};base64,${base}`;

            //const base64Image = `data:${env.frisorer[i].img.contentType};base64,${window.btoa(env.frisorer[i].img.data.data)}`;
            midlertidigArray.push(base64Image);
        }
        sFrisorBildeArray(midlertidigArray);
    }
    useEffect(()=>{
        //Lager et array med base64 bilder
        
        hentBilder();
    }, [env])

    return(<div style={{position:"relative"}}>
        <div className="hjem">
            <header>
                <div className="bedriftNavnHeader"> <div className="viEr" >Vi er </div>{env.bedrift}</div>
                <div>
                    <p className="bestilleTimeplz">Ønsker du å bestille time hos oss?</p>
                    <Link to="/timebestilling" className='navBarBestillTime' tabIndex={0}><div style={{textShadow:"1px 1px 3px black"}}>Bestill time</div></Link>
                </div>
            </header>

        </div>
        <div className="startContainer">
        <div style={{padding:"2rem"}}>
                <h1>Velkommen!</h1>
                <p style={{fontSize:"larger"}}>{env.omOssArtikkel}</p>
            </div>
        <div className="startside">
            
            <div className="hjemsideSeksjon">
                <h2>Åpningstider</h2>
                <div>
                     {env.klokkeslett.map((tid, index)=>(
                         <div key={tid.dag} style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly", fontWeight:(new Date().getDay() === index? "bold":"400")}}>
                             <p>{tid.dag}:</p> <p>{tid.stengt?"Stengt":`${tid.open} - ${tid.closed}`}</p>
                         </div>
                     ))}
                </div>
            </div>
            <div className="hjemsideSeksjon">
                <h2>Våre ansatte</h2>
                <div className="frisorene">
                    {frisorBildeArray !== null? env.frisorer.map((frisor, index)=>(
                    <div key={frisor.navn}style={{margin:"1rem"}}>
                        <h4>{frisor.navn}</h4>
                        <img className="frisorbilde" src={frisorBildeArray[index]} alt={`Bilde av ansatt ${frisor.navn}`} style={{height:"4rem"}}></img>
                        <button id={frisor.navn} aria-expanded={visDetaljerFrisor && detaljerFrisor !== null} aria-label={`Vis detaljer om ansatt: ${frisor.navn}`} className="infoFrisorKnapp" onClick={()=>{
                            sDetaljerFrisor(frisor);
                            sVisDetaljerFrisor(true);
                        }} onKeyDown={(e)=>{
                            if(e.code === "Enter" || e.code === "Space"){
                                sDetaljerFrisor(frisor);
                                sVisDetaljerFrisor(true);
                            }
                        }}></button>
                        </div>
                    )):"hhh"}
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
                            <img className="frisorbilde" src={frisorBildeArray[env.frisorer.indexOf(detaljerFrisor)]} alt={`Bilde av ansatt ${detaljerFrisor.navn}`} style={{height:"20rem", width:"20rem"}}></img>
                                <div>
                                    <h3 style={{margin:"0"}}>{detaljerFrisor.navn}</h3>
                                    {detaljerFrisor.tittel}
                                </div>
                                <p>{detaljerFrisor.beskrivelse}</p>
                        </div>
                    </>:<></>}
                </div>
            </div>
            
        </div>

        <div className="startside">
            
            <div className="hjemsideSeksjon">
                <h2>Hvor du finner oss</h2>

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
                <h2 >Våre behandlinger</h2>
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
        
        </div>
        <Footer/>
            
        </div>
    )
}

export default React.memo(Hjem)