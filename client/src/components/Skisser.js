import React, {useRef} from 'react'

function Skisser({env, valgteSkisser, sValgteSkisser, skisseFiler, sSkisseFiler}){

    //bytt ut med env.skisser
    const valgteSkisserBoks = useRef(null);
    return (
    <div className='column2'>
        <div ref={valgteSkisserBoks}></div>
        <h3>Velg bilder: </h3>
        <p>VALGFRITT: last opp eller velg bilde(r) av ønsket resultat etter besøk hos oss! </p>
        {valgteSkisser.length > 0 || skisseFiler.length > 0 ? <h4>Dine valgte bilder: </h4>:""}

        <div className='row'>
            {skisseFiler.length > 0 && skisseFiler.map((s, index)=><img alt={s} key={index} className='skisseBilde' src={URL.createObjectURL(s)}></img>)}
            {valgteSkisser && valgteSkisser.map((s, index)=><img alt={s.alt} key={index} className='skisseBilde' src={`${window.origin}/uploads/${s.filnavn}`}></img>)}
        </div>
        <h4>Last opp bilde(r)</h4>
        <input onChange={(e)=>{
            if(e.target.files.length < 4){

                let skisseFilerTemp = [];

                for(let i = 0; i < e.target.files.length; i++){
                    skisseFilerTemp.push(e.target.files[i]);
                    
                }
                sSkisseFiler(skisseFilerTemp);
            } else {
                alert("Du kan ikke laste opp mer enn 3 skisser");
            }
        }} type='file' accept='image/*' multiple></input>
        
        {env.skisser.length > 0 && <>
        <h4>Velg også bilder herfra</h4></>}
        <div className='row' style={{justifyContent:"flex-start"}}>
        {env.skisser.map((bilde, index)=><img aria-checked={valgteSkisser.includes(bilde)} role='checkbox' tabIndex={0} alt={"Trykk for å legge til bildet: " + bilde.alt} style={{border:(valgteSkisser.includes(bilde)?"3px solid black":"")}} key={index} className='skisseBilde' src={`${window.origin}/uploads/${bilde.filnavn}`} onClick={(e)=>{
            if(!valgteSkisser.includes(bilde)){
                sValgteSkisser([...valgteSkisser, bilde]);
            } else {
                sValgteSkisser(valgteSkisser.filter((skisse)=>skisse.filnavn!==bilde.filnavn));
            }
            valgteSkisserBoks.current.scrollIntoView({behavior: "smooth", block:"start"});
        }} onKeyDown={(e)=>{
            if(e.code === "Enter" || e.code === "Space"){       
                
                if(!valgteSkisser.includes(bilde)){
                    sValgteSkisser([...valgteSkisser, bilde]);
                } else {
                    sValgteSkisser(valgteSkisser.filter((skisse)=>skisse.filnavn!==bilde.filnavn));
                }
                valgteSkisserBoks.current.scrollIntoView({behavior: "smooth", block:"start"});
            }
        }}></img>)}
        </div>
    </div>
  )
}

export default React.memo(Skisser);