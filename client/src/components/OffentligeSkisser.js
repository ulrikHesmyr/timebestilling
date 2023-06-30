import React, {useState} from 'react'

function OffentligeSkisser({env, sUpdateTrigger, updateTrigger, lagreVarsel, varsle, varsleFeil}){
    const [visLeggTilSkisse, sVisLeggTilSkisse] = useState(false);
    const [visSlettSkisse, sVisSlettSkisse] = useState(false);
    const [skisser, sSkisser] = useState(undefined);
    const [alt, sAlt] = useState(""); 


    async function slettSkisse(skisse){
        lagreVarsel();
        try {
            const req = await fetch("http://localhost:1227/timebestilling/slettSkisse/skisse" + skisse, {
                method: "POST",
                //credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const res = await req.json();
            if(res.valid){
                varsle();
                sUpdateTrigger(!updateTrigger);
                sVisSlettSkisse(false);
            }
        } catch (error) {
            varsleFeil();
            alert("Noe gikk galt, sjekk internettforbindelsen din og prøv igjen");
        }
    }
    async function lastOppSkisse(){
        lagreVarsel();
        try {
            
            let formData = new FormData();
            formData.append('alt', alt)
            formData.append('fil', skisser);
            
            const req = await fetch("http://localhost:1227/timebestilling/lastOppSkisse", {
                method: "POST",
                //credentials: "include",
                body: formData
            })
            const res = await req.json();
            if(res.valid){
                varsle();
                sUpdateTrigger(!updateTrigger);
                sVisLeggTilSkisse(false);
            }
        } catch (error) {
            varsleFeil();
            alert("Noe gikk galt, sjekk internettforbindelsen din og prøv igjen");
        }
    }

  return (
    <div>
        <h4>Bilder: </h4>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"   }}>
            <button onClick={()=>{
                sVisLeggTilSkisse(true);
            }} style={{display:"flex", alignItems:"center"}}>
                <img alt="Legg til ny skisse" className='ikonKnapper' src="leggtil.png"></img>
                Legg til nytt bilde
            </button>
            <button onClick={()=>{
                sVisSlettSkisse(true);
            }} style={{display:"flex", alignItems:"center"}}>
                <img alt="Legg til ny skisse" className='ikonKnapper' src="rediger.png"></img>
                Rediger bilder
            </button>
        </div>
        <div  className='row' style={{justifyContent:"flex-start"}}>
            {env.skisser.map((skisse, index)=>{
                return <img className='skisseBilde' key={index} src={`${window.origin}/uploads/${skisse.filnavn}`} alt={skisse.alt}></img>
            })}
        </div>

        {visLeggTilSkisse && 
            <div className='fokus'>
                <div className='lukk' onClick={()=>{
                    sVisLeggTilSkisse(false);
                }}></div>
                <h4>Legg til nytt bilde</h4>
                <p>Last opp bilder som kundene kan velge når de bestiller time. Lag også en beskrivelse av bildet slik at svaksynte og andre som bruker skjermleser også kan få med seg innholdet.</p>
                <input onChange={(e)=>{
                    if(e.target.files.length > 0){
                        sSkisser(e.target.files[0]);
                    }
                }} type='file' accept='image/*'></input>
                <label>Beskrivelse: <input value={alt} onChange={(e)=>{
                    sAlt(e.target.value);
                }} ></input></label>
                <button onClick={()=>{
                    if(alt.length > 0 && skisser){
                        lastOppSkisse();
                    } else {
                        alert("Ikke riktig format");
                    }
                }}>BEKREFT</button>
            </div>
        }
        {visSlettSkisse && 
        <div className='fokus'>
            <div className='lukk' onClick={()=>{
                sVisSlettSkisse(false);
            }}></div>

            <h4>Fjern bilder: </h4>
            <p>Trykk på slette-ikonet for å slette den fra bildene som kundene kan velge mellom når de bestiller time.</p>
            <div className='column2' style={{alignItems:"flex-start"}}>
                {env.skisser.map((skisse, index)=>{
                    return <div key={index} className='row'>
                        <img className='skisseBilde' src={`${window.origin}/uploads/${skisse.filnavn}`} alt={skisse.alt}></img>
                        <img alt="Slett skisse" onClick={()=>{
                            if(window.confirm("Er du sikker på at du vil slette denne skissen?")){
                                slettSkisse(skisse.filnavn);
                            }
                        }} className='ikonKnapper' src="delete.png"></img>
                    </div>
                }
                )}
            </div>
        </div>}
    </div>
  )
}

export default React.memo(OffentligeSkisser);