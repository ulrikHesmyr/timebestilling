import React, {useRef} from 'react'

function Skisser({env, valgteSkisser, sValgteSkisser, skisseFiler, sSkisseFiler}){

    //bytt ut med env.skisser
    const valgteSkisserBoks = useRef(null);
    return (
    <div className='column2'>
        <div ref={valgteSkisserBoks}></div>
        <h3>Velg skisser: </h3>
        <p>Last opp skisse eller velg en av skissene under, slik at vi kan se hvilke(n) tatovering(er) du vil ha eller noe som ligner på det du vil ha! Det er valgfritt å velge skisser, så dersom du ikke har bestemt deg ennå, så kan du trykke fortsett nedenfor!</p>
        {valgteSkisser.length > 0 || skisseFiler.length > 0 ? <h4>Dine valgte skisser: </h4>:""}

        <div className='row'>
            {skisseFiler.length > 0 && skisseFiler.map((s, index)=><img alt={s} key={index} className='skisseBilde' src={URL.createObjectURL(s)}></img>)}
            {valgteSkisser && valgteSkisser.map((s, index)=><img alt={s} key={index} className='skisseBilde' src={`${window.origin}/uploads/${s}`}></img>)}
        </div>
        <h4>Last opp skisse(r)</h4>
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
        <h4>Velg også skisser herfra</h4></>}
        <div className='row' style={{justifyContent:"flex-start"}}>
        {env.skisser.map((bilde, index)=><img alt={bilde} style={{border:(valgteSkisser.includes(bilde)?"3px solid black":"")}} key={index} className='skisseBilde' src={`${window.origin}/uploads/${bilde}`} onClick={(e)=>{
            if(!valgteSkisser.includes(bilde)){
                sValgteSkisser([...valgteSkisser, bilde]);
            } else {
                sValgteSkisser(valgteSkisser.filter((skisse)=>skisse!==bilde));
            }
            valgteSkisserBoks.current.scrollIntoView({behavior: "smooth", block:"start"});
        }}></img>)}
        </div>
    </div>
  )
}

export default React.memo(Skisser);