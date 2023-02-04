import React, {useState, useEffect} from "react";
import Fortsett from "./Fortsett";

function Frisor({tilgjengeligeFrisorer, env, synligKomponent, displayKomponent, produkt, klokkeslettet, sKlokkeslett ,frisor, sFrisor}){

    const [frisorBildeArray, sFrisorBildeArray] = useState(null);
    useEffect(()=>{
        //let bildeArray = env.frisorer.map((element)=>(element.img?`data:${element.img.contentType};base64,${new Buffer.from(element.img.data, 'hex').toString('base64')}`:"person.png"));
        //sFrisorBildeArray(bildeArray);
        //console.log(bildeArray);
        // Convert the array of numbers into a Uint8Array
        //const arrayOfNumbers = new Uint8Array(env.frisorer[5].img.data.data);
        //const binaryString = Array.from(arrayOfNumbers, x => String.fromCharCode(x)).join('');
        //const base64Image = window.btoa(binaryString);

        //Lager et array med base64 bilder
        let midlertidigArray = [];
        console.log(env.frisorer);
        for(let i = 0; i < env.frisorer.length; i++){
            const array = new Uint8Array(env.frisorer[i].img.data.data);
            const base = window.btoa(String.fromCharCode.apply(null, array));
            const base64Image = `data:${env.frisorer[i].img.contentType};base64,${base}`;

            //const base64Image = `data:${env.frisorer[i].img.contentType};base64,${window.btoa(env.frisorer[i].img.data.data)}`;
            midlertidigArray.push(base64Image);
        }
        //const array2 = new Uint8Array(env.frisorer[5].img.data.data);
        //const base2 = window.btoa(String.fromCharCode.apply(null, array2));
        console.log(midlertidigArray);
        sFrisorBildeArray(midlertidigArray);
    }, [])
    return(
        <div className={synligKomponent === 1? 'animer-inn':""}>
            <div onClick={()=>{
                sFrisor(false);
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }

                }} style={{border: frisor === false?"3px solid black":"thin solid black", cursor:"pointer", padding:"0.2rem", width:"fit-content"}}>
                    
                    Første ledige frisør
                </div>
            <div className="frisorene">
            
                {frisorBildeArray !== null?tilgjengeligeFrisorer.map((element, index)=>(<div className="frisor" 
                key={element.navn} onClick={()=>{
                    sFrisor(element);
                    if(klokkeslettet != null){
                        sKlokkeslett(null);
                    }

                }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                    <img src={frisorBildeArray[index]} alt={`Bilde av frisør ${element.navn}`} style={{height:"4rem", aspectRatio:1/1, objectFit:"contain"}}></img>
                    {element.navn}
                    {(element.produkter.length === env.tjenester.length?(<p>hvilken som helst behandling</p>):element.produkter.map((index)=>(<p key={index}>{env.tjenester[index].navn}</p>)))}
                </div>)):""}
            </div>
            <Fortsett disabled={(frisor !== null?false:true)} number={2} displayKomponent={displayKomponent} />
        </div>
    )
}

export default React.memo(Frisor);