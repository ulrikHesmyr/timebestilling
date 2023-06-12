import React, {useRef} from 'react'

function Skisser({valgteSkisser, sValgteSkisser, dato, klokkeslettet, sSkisser, skisser, synligKomponent, skisseFiler, sSkisseFiler}){

    let bilder = ["omOss.jpg", "bilde3.jpg", "bilde2.jpg", "qdwomOss.jpg", "bildqwde3.jpg", "bilqdde2.jpg"];
    //bytt ut med env.skisser
    const valgteSkisserBoks = useRef(null);
  return (
    <div className='column2'>
        {skisser || skisseFiler ? <h3 ref={valgteSkisserBoks}>Dine valgte skisser: </h3>:""}
        <div className='row'>
            {skisseFiler && skisseFiler.map((s, index)=><img key={index} className='skisseBilde' src={URL.createObjectURL(s)}></img>)}
            {valgteSkisser && valgteSkisser.map((s, index)=><img key={index} className='skisseBilde' src={`${window.origin}/uploads/${s}`}></img>)}
        </div>
        <h4>Last opp skisse(r)</h4>
        <input onChange={(e)=>{
            let skisserTemp = [];
            let skisseFilerTemp = [];

            for(let i = 0; i < e.target.files.length; i++){
                skisseFilerTemp.push(e.target.files[i]);
                skisserTemp.push(new Date().getTime() + "skisse" + i + dato + klokkeslettet + ".jpg");
            }
            console.log(skisseFilerTemp);
            sSkisser(skisserTemp);
            sSkisseFiler(skisseFilerTemp);
        }} type='file' accept='image/*' multiple></input>
        <strong>OG/ELLER</strong>
        <h4>Velg også skisser herfra</h4>
        <div className='row' style={{justifyContent:"flex-start"}}>
        {bilder.map((bilde, index)=><img style={{border:(valgteSkisser.includes(bilde)?"3px solid black":"")}} key={index} className='skisseBilde' src={`${window.origin}/uploads/${bilde}`} onClick={(e)=>{
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