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

    //Bildene til frisørene
    const [frisorBildeArray, sFrisorBildeArray] = useState(null);
    
    //Behandlinger
    const [kategoriSynlig, setKategoriSynlig] = useState(env.kategorier.map(kategori=>kategori = false));
    const [K, sK] = useState(false);

    useEffect(()=>{
        //Lager et array med base64 bilder
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
        hentBilder();
    }, [env.frisorer])

    return(<>
        <div className="hjem">
            <header style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"flex-end", flexWrap:"wrap"}}>
                <p className="viEr" >Vi er </p><p className="bedriftNavnHeader">{env.bedrift}</p>
                
            </header>
            <Link to="/timebestilling" className='navBarBestillTime'><div>Bestill time</div></Link>

        </div>
        <div className="startContainer">
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
                        <img className="frisorbilde" src={frisorBildeArray[index]} alt={`Bilde av frisør ${frisor.navn}`} style={{height:"4rem"}}></img>
                        </div>
                    )):"hhh"}
                </div>
            </div>
        </div>
        <div className="startside">
            
            <div className="hjemsideSeksjon">
                <h2>Hvor du finner oss</h2>

                <div>
                    
                    <div onClick={()=>{
                        window.open(`https://www.google.com/maps/place/${env.adresse.gatenavn.replace(/ /g, "+")}+${env.adresse.husnummer}${env.adresse.bokstav},+${env.adresse.postnummer}+${env.adresse.poststed}/@${env.adresse.rep.lat},${env.adresse.rep.lng}`);
                    }} className="adresseLink"><div className="adresseBlur"><p>{env.adresse.gatenavn} {env.adresse.husnummer}{env.adresse.bokstav}, {env.adresse.postnummer} {env.adresse.poststed}</p><div>GÅ TIL KART</div></div></div>
                
                </div>
            </div>
            <div className="hjemsideSeksjon">
                <h2 >Våre behandlinger</h2>
                <div className="behandlingerHjemsiden">
                {env.kategorier.map((kategori, index)=>(
                    <div key={kategori} style={{cursor:"pointer", transition:"0.2s ease all", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 role="button" aria-label={`Vis behandlingene for kategorien ${kategori}`} aria-expanded={kategoriSynlig[index]} aria-controls={`${kategori}tjeneste`} id={kategori} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottom:"thin solid rgba(0,0,0,0.3)"}} onClick={()=>{
                            let temp = kategoriSynlig;
                            let n = env.kategorier.indexOf(kategori);
                            if(kategoriSynlig[n]){
                                temp[n] = false;
                            } else {
                                temp[n] = true;
                            }
                            setKategoriSynlig(temp);
                            sK(!K);
                        }}>{kategori} <img className={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?"rotert":"")} alt={(kategoriSynlig[env.kategorier.indexOf(kategori)] === true?`Innhold for kategorien ${kategori} vises`:`innhold for kategorien ${kategori} vises ikke`)} style={{height:"1.9rem", transition:"0.5s ease all"}} src="lukket.png"></img> </h3>
                        <div aria-hidden={!(kategoriSynlig[index])} role="region" id={`${kategori}tjeneste`} aria-labelledby={kategori} className="tjenestene" style={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?{ height:"auto", overflow:"visible", opacity:"1", transition:"0.3s ease 0.05s all"}:{height:"2rem", overflow:"hidden", opacity:"0", transition:"0.3s ease 0.05s all", transform:"translateY(-20px)"}}>
                            {env.tjenester.filter(element=>element.kategori === kategori).map((tjeneste)=>(
                                <div key={tjeneste.navn}>
                                    <div>
                                        <li style={{fontWeight:"500"}}>{tjeneste.navn}</li>
                                        <p style={{fontWeight:"200"}}>{tjeneste.beskrivelse}</p>
                                        <p>Pris: {tjeneste.pris} kr</p>
                                        <p>Tid: {tjeneste.tid} minutter</p>
                                    </div>
                                </div>
                                )
                            )}
                        </div>
                        
                    </div>
                    
                    
                    
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
        </div>
            
        </>
    )
}

export default React.memo(Hjem)