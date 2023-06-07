import React, {useEffect, useState} from 'react'



function RedigerOmOss({env, varlseFeil, varsle, lagreVarsel, sUpdateTrigger, updateTrigger}){
    
    const [omOssFeed, sOmOssFeed] = useState([...env.omOssFeed]);

    const [imageBlobs, sImageBlobs] = useState(new Map());

    const [visLeggTilInnhold, sVisLeggTilInnhold] = useState(false);

    const [type, sType] = useState("");

    const [p, sP] = useState("");
    const [h, sH] = useState("");
    const [i, sI] = useState(null);
    const [alt, sAlt] = useState("");

    const [previewImg, sPreviewImg] = useState(null);


    useEffect(()=>{

        
        async function hentBlob(){
            let tempOmOss = [...env.omOssFeed]
            for(let i = 0; i < tempOmOss.length; i++){
                if(tempOmOss[i].type === "i"){
                    const imgBlob = await fetch("http://localhost:1227/uploads/" + tempOmOss[i].content)
                    .then(r => r.blob());

                    const imgBlobUrl = URL.createObjectURL(imgBlob);
                    tempOmOss[i].src = imgBlobUrl;
                }
            }
            sOmOssFeed(tempOmOss);
            
        }
        hentBlob();
        
    }, [env.omOssFeed]);

    useEffect(()=>{
        async function hentBlob(){
            let tempOmOss = [...env.omOssFeed]
            for(let i = 0; i < tempOmOss.length; i++){
                if(tempOmOss[i].type === "i"){
                    const imgBlob = await fetch("http://localhost:1227/uploads/" + tempOmOss[i].content)
                    .then(r => r.blob());

                    const imgBlobUrl = URL.createObjectURL(imgBlob);
                    tempOmOss[i].src = imgBlobUrl;
                }
            }
            sOmOssFeed(tempOmOss);
            
        }
        hentBlob();

        
    }, []);

    async function leggTilInnhold(objektet){
        lagreVarsel();
        try {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({objektet: objektet})
          }
          const response = await fetch('http://localhost:1227/env/leggTilInnhold', options);
          const data = await response.json();
          if(data){
            varsle();
            sUpdateTrigger(!updateTrigger);
            sVisLeggTilInnhold(false);
          }
        } catch (error) {
          varlseFeil();
          alert("Noe gikk galt, sjekk internettforbindelsen og prøv igjen");
        }
    }

    async function leggTilBilde(){
        
        lagreVarsel();
        try {
            const mittObjekt = {content: new Date().getTime() + ".jpg", type: "i", alt: alt};
            let formData = new FormData();
            formData.append("uploaded_file", i);
            formData.append("objektet", JSON.stringify(mittObjekt));
            const options = {
                method: 'POST',
                body: formData
            }
            const response = await fetch('http://localhost:1227/env/lastOppBilde/' + mittObjekt.content, options);
            const data = await response.json();
            if(data){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }   
        } catch (error) {
            varlseFeil();
            alert("Noe gikk galt, sjekk internettforbindelsen og prøv igjen");
        }
    }

    async function slettInnhold(content){
        lagreVarsel();
        try {
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: content})
            }
            const response = await fetch('http://localhost:1227/env/slettInnhold', options);
            const data = await response.json();
            if(data){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            varlseFeil();
            alert("Noe gikk galt, sjekk internettforbindelsen og prøv igjen");
        }
    }

    async function flyttOpp(index){
        if(index !== 0){
            
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({index: index})
                }
                const request = await fetch('http://localhost:1227/env/flyttOpp', options);
                const data = await request.json();
                if(data){
                    varsle();
                    sUpdateTrigger(!updateTrigger);
                }
                
            } catch (error) {
                varlseFeil();
                alert("Noe gikk galt, sjekk internettforbindelsen og prøv igjen");
            }
        }
    }

    async function flyttNed(index){
        if(index !== omOssFeed.length-1){
            
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({index: index})
                }
                const request = await fetch('http://localhost:1227/env/flyttNed', options);
                const data = await request.json();
                if(data){
                    varsle();
                    sUpdateTrigger(!updateTrigger);
                }
                
            } catch (error) {
                varlseFeil();
                alert("Noe gikk galt, sjekk internettforbindelsen og prøv igjen");
            }
        }
    }
  
    return (
    <div>
        <h2>Rediger Om-oss siden</h2>
        <div className='omOssFeed'>
            {omOssFeed.map((innhold, index) => 
                <div key={index} className='omOssElement'>
                    {innhold.type === "i" && <img className='omOssBilde' src={innhold.src} alt={innhold.alt}></img>}
                    {innhold.type === "p" && <p>{innhold.content}</p>}
                    {innhold.type === "h" && <h2>{innhold.content}</h2>}
                    <div className='handlingerOmOss'>
                        <div className='flytteKnapper'>
                            <img onClick={()=>{
                                flyttOpp(index);
                            }} className="flyttOpp ikonKnapper" src="lukket.png" alt="flytt opp"></img>
                            <img onClick={()=>{
                                flyttNed(index);
                            }} className="flyttNed ikonKnapper" src="lukket.png" alt="flytt ned"></img>
                        </div>
                        <button onClick={()=>{
                            if(window.confirm("Vil du slette dette innholdet?")){
                                slettInnhold(innhold.content);
                            }
                        }} className='slettKnapp'></button>
                    </div>
                </div>)}
        </div>
        {visLeggTilInnhold ?<div className='fokus'>
            <div onClick={()=>{
                sVisLeggTilInnhold(false);
            }} className='lukk'></div>
            <h4>Legg til innhold</h4>
            <p>Legg til et nytt element i innholds-feeden på "Om oss"-siden. Her kan du legge til bilde, overskrift eller en paragraf.</p>
            <br></br><br></br>
            <div className='column'>
                <div className='row'>
                    <button onClick={()=>{
                        sType("i");
                    }}>Bilde</button>
                    <button onClick={()=>{
                        sType("h");
                    }}>Overskrift</button>
                    <button onClick={()=>{
                        sType("p");
                    }}>Paragraf</button>
                </div>
                
                {type !== "" && <div className='fokus'>
                    
                    {type === "i" && <><label>Last opp bilde her: <input onChange={(e)=>{
                        sI(e.target.files[0]);
                        sPreviewImg(URL.createObjectURL(e.target.files[0]))
                    }} type="file" accept='image/*'></input>
                    {previewImg !== null && <img style={{height:"10rem"}} src={previewImg}></img>}
                    
                    </label> 
                    
                    <label>Legg til tekst som beskriver bildet: <input onChange={(e)=>{
                        sAlt(e.target.value);
                    }} value={alt} type="text"></input> (Denne teksten vil ikke være synlig og er kun for svaksynte som bruker skjermleser)</label></>}
    
                    {type === "h" && <label>Skriv inn overskrift her: <input onChange={(e)=>{
                        sH(e.target.value);
                    }} value={h} type="text"></input></label>}
    
                    {type === "p" && <label>Skriv inn paragraf her: <textarea onChange={(e)=>{
                        sP(e.target.value);
                    }} value={p}></textarea></label>}
    
                        <div>
                            <button onClick={()=>{
                                sType("");
                                sPreviewImg(null);
                                sI(null);
                                sH("");
                                sP("");
                                sAlt("");
                            }}>Avbryt</button>
                            <button onClick={()=>{
                                switch(type){
                                    case "i":
                                        leggTilBilde();
                                        break;
                                    case "h":
                                        leggTilInnhold({content: h, type: "h"});
                                        break;
                                    case "p":
                                        leggTilInnhold({content: p, type: "p"});
                                        break;
                                    default:
                                        break;
                                }
                                sType("");
                                sPreviewImg(null);
                                sI(null);
                                sH("");
                                sP("");
                                sAlt("");
                            }}>Lagre</button>
                        </div>
                    </div>}
                
                </div>
        </div>
        
        :<button className='row' onClick={()=>{
            //const mittObjekt = new P("aaaaaaaaaaaaaaaaaaaaaaa");
            //leggTilInnhold(mittObjekt, "p");
            //sOmOssFeed([...omOssFeed, mittObjekt]);
            sVisLeggTilInnhold(true);
        }}><img alt="Legg til innhold" src="leggtil.png" className='ikonKnapper'></img>Legg til</button>}
    </div>
  )
}

export default React.memo(RedigerOmOss);