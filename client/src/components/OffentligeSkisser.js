import React, {useState} from 'react'

function OffentligeSkisser({env, sUpdateTrigger, updateTrigger, lagreVarsel, varsle, varsleFeil}){
    const [visLeggTilSkisse, sVisLeggTilSkisse] = useState(false);
    const [visSlettSkisse, sVisSlettSkisse] = useState(false);
    const [skisser, sSkisser] = useState([]);


    async function slettSkisse(skisse){
        lagreVarsel();
        try {
            const req = await fetch(`http://localhost:1227/timebestilling/slettSkisse/${skisse}`, {
                method: "POST"
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
            for(let i = 0; i < skisser.length; i++){
                formData.append('fil', skisser[i]);
            }
            const req = await fetch("http://localhost:1228/timebestilling/lastOppSkisse", {
                method: "POST",
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
                return <img className='skisseBilde' key={index} src={`${window.origin}/uploads/${skisse}`} alt={skisse}></img>
            })}
        </div>

        {visLeggTilSkisse && 
            <div className='fokus'>
                <div className='lukk' onClick={()=>{
                    sVisLeggTilSkisse(false);
                }}></div>
                <h4>Legg til nytt bilde</h4>
                <p>Last opp bilder som kundene kan velge når de bestiller time</p>
                <input onChange={(e)=>{
                    if(e.target.files.length > 0){
                        let tempFiler = [];
                        for(let i = 0; i < e.target.files.length; i++){
                            tempFiler.push(e.target.files[i]);
                        }
                        sSkisser(tempFiler);
                    }
                }} type='file' accept='image/*' multiple></input>
                <button onClick={()=>{
                    lastOppSkisse();
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
                        <img className='skisseBilde' src={`${window.origin}/uploads/${skisse}`} alt={skisse}></img>
                        <img alt="Slett skisse" onClick={()=>{
                            if(window.confirm("Er du sikker på at du vil slette denne skissen?")){
                                slettSkisse(skisse);
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