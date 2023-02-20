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
            <header>
                <h1>Vi er {env.bedrift}</h1>
                
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
                    <p>{env.adresse}</p>
                    <img alt="Bilde som viser adressen" src="adresse.png" style={{width:"200px"}}></img>
                <img alt="Vaske håret meme" src="meme.png" style={{height:"10rem"}}></img>
                </div>
            </div>
            <div className="hjemsideSeksjon">
                <h2 >Våre behandlinger</h2>
                <div className="behandlingerHjemsiden">
                {env.kategorier.map((kategori, index)=>(
                    <div key={kategori} style={{transition:"0.2s ease all", padding:"0.3rem", borderRadius:(kategoriSynlig[index]?"0 0 1rem 1rem":"0 0 0 0")}}>
                        <h3 style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottom:"thin solid rgba(0,0,0,0.3)"}} onClick={()=>{
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
                        <div className="tjenestene" style={kategoriSynlig[env.kategorier.indexOf(kategori)] === true?{ height:"auto", overflow:"visible", opacity:"1", transition:"0.3s ease 0.05s all"}:{height:"2rem", overflow:"hidden", opacity:"0", transition:"0.3s ease 0.05s all", transform:"translateY(-20px)"}}>
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