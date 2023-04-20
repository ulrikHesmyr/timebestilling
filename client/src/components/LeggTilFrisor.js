import React, {useState} from 'react'
import {minutterFraKlokkeslett} from './Klokkeslett.js'

function LeggTilFrisor({env, updateTrigger, sUpdateTrigger, varsle, lagreVarsel, varsleFeil}){

    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [nyFrisorTittel, sNyFrisorTittel] = useState("");
    const [nyFrisorBeskrivelse, sNyFrisorBeskrivelse] = useState("");
    const [tlfNyFrisor, sTlfNyFrisor] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);
    const [paaJobb, sPaaJobb] = useState(env.klokkeslett.map(obj => ({ ...obj })));
    
    const [adminTilgang, sAdminTilgang] = useState(false);

    const [preview, setPreview] = useState(null);
    const [leggtil, sLeggTil] = useState(false);


    async function lagre(){
        try {
            
        lagreVarsel();
        sLeggTil(false);
        
        let formData = new FormData();
        formData.append("uploaded_file", bildeAvFrisor);
        formData.append("nyFrisorNavn", nyFrisorNavn);
        formData.append("nyFrisorTlf", parseInt(tlfNyFrisor));
        formData.append("nyFrisorTjenester", frisorTjenester);
        formData.append("tittel", nyFrisorTittel);
        formData.append("beskrivelse", nyFrisorBeskrivelse);
        formData.append("paaJobb", JSON.stringify(paaJobb));
        const options2 = {
            method:"POST",
            credentials: 'include',
            body: formData
        }
        const request2 = await fetch("/env/opprettFrisor", options2);
        const response2 = await request2.json();

        //Oppretter bruker for frisøren
        if(response2){

            
            const data = {
                nyBrukernavn: nyFrisorNavn.toLowerCase(),
                nyTelefonnummer: parseInt(tlfNyFrisor),
                adminTilgang: adminTilgang
            }
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials: 'include',
                body: JSON.stringify(data)
            }
            const request = await fetch("/login/opprettBruker", options);
            const response = await request.json();
            if(response && response.m){
                alert(response.m);
            } else if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
                setFrisortjenester([]);
                sTlfNyFrisor("");
                sNyFrisorNavn("");
                sNyFrisorBeskrivelse("");
                sNyFrisorTittel("");
                sBildeAvFrisor(null);
                sAdminTilgang(false);
                sPaaJobb(env.klokkeslett.map(obj => ({ ...obj })));
            } else {
                alert("Noe gikk galt. Prøv igjen.");
            }

        } else {
            alert("Noe gikk galt. Prøv igjen.");
        }
            
        


        } catch (error) {
            alert("Bildet er for stort eller på feil format. Bilde må ha formatet .jpg, .jpeg, eller .png og være mindre enn 2mb.");
            varsleFeil();
        }
    }


    function avbryt(){
        setFrisortjenester([]);
        sLeggTil(false);
        sTlfNyFrisor("");
        sNyFrisorNavn("");
        sNyFrisorBeskrivelse("");
        sNyFrisorTittel("");
    }
  return (
    <>
    {leggtil?<div className='fokus' >
        <label style={{fontWeight:"bold"}}>Navn på ny frisør: <input onChange={(e)=>{
            sNyFrisorNavn(e.target.value);
        }} value={nyFrisorNavn} type="text" placeholder='Navn navnesen' maxLength={20}></input></label>

        <label style={{fontWeight:"bold"}}>Tittel: <input onChange={(e)=>{
            sNyFrisorTittel(e.target.value);
        }} value={nyFrisorTittel} type="text" placeholder='eks.: Frisør, Terapeut, etc.' maxLength={20}></input></label>

        <label style={{fontWeight:"bold"}}>Info: <textarea onChange={(e)=>{
            sNyFrisorBeskrivelse(e.target.value);
        }} value={nyFrisorBeskrivelse} placeholder='Navn har jobbet hos oss siden... Hen er kreativ og liker å jobbe med... Nøyaktig og opptatt av å forstå kundens behov...'></textarea></label>

        <label style={{fontWeight:"bold"}}>Telefonnummeret til frisøren: <input style={{letterSpacing:"0.3rem"}} onChange={(e)=>{
            sTlfNyFrisor(e.target.value);
        }} value={tlfNyFrisor} type="text" maxLength={8}></input></label>
        <label style={{display:"flex", alignItems:"center"}}>Last opp bilde av Frisøren: <input accept="image/*" onChange={(e)=>{
            sBildeAvFrisor(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }} type="file" name="uploaded_file"></input>Last opp bilde her: Maks 2mb {preview && <img className='frisorbilde' style={{height:"300px"}} alt='Forhåndsvisning av bildet' src={preview}></img>}</label>
        

        <p style={{fontWeight:"bold"}} >Velg behandlinger for frisør:</p>

        {env.tjenester.map((tjeneste)=>
        (<div style={{userSelect:"none", backgroundColor:(frisorTjenester.includes(tjeneste.navn)?"lightgreen":"white"), cursor:"pointer"}} key={tjeneste.navn} onClick={()=>{
            if(frisorTjenester.includes(tjeneste.navn)){
                setFrisortjenester(frisorTjenester.filter(element=>element !== tjeneste.navn));
            } else {
                setFrisortjenester([...frisorTjenester, tjeneste.navn]);
            }
        }}>
            <input type="checkbox" readOnly checked={frisorTjenester.includes(tjeneste.navn)}></input>
            {tjeneste.navn}
        </div>)
        )}

        <p style={{fontWeight:"bold"}}>Velg hvilke dager og klokkeslett frisøren skal jobbe:</p>
        <p className='litentekst'>Kryss av i ruten dersom vedkommende ikke er på jobb denne dagen</p>
        {paaJobb.map((dag, index)=>{
            return (
                <div style={{display: "flex", flexDirection:"column", justifyContent: "center", borderTop:"1px solid black"}} key={dag.dag}>
                    {dag.dag}
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        
                        <input type="checkbox" onChange={(e)=>{
                        const nyPaaJobb = [...paaJobb];
                        nyPaaJobb[index].stengt = e.target.checked;
                        sPaaJobb(nyPaaJobb);
                    }} checked={dag.stengt} disabled={env.klokkeslett[index].stengt}></input>
                    
                    <input disabled={env.klokkeslett[index].stengt || paaJobb[index].stengt} onChange={(e)=>{
                        let detteKlokkeslettet = e.target.value;
                        let klMinutter = minutterFraKlokkeslett(detteKlokkeslettet);
                        
                        if(klMinutter < minutterFraKlokkeslett(dag.closed) && klMinutter >= minutterFraKlokkeslett(env.klokkeslett[index].open) && klMinutter <= minutterFraKlokkeslett(env.klokkeslett[index].closed) && klMinutter % 15 === 0){
                            const nyPaaJobb = [...paaJobb];
                            nyPaaJobb[index].open = detteKlokkeslettet;
                            sPaaJobb(nyPaaJobb);
                        } else {
                            alert("Klokkeslettet må være før ansatt er ferdig på jobb");
                        }
                    }} type='time' step="1800" min={env.klokkeslett[index].open} max={dag.closed} value={env.klokkeslett[index].stengt?undefined:dag.open}></input> 
                    
                    - 
                    
                    <input disabled={env.klokkeslett[index].stengt || paaJobb[index].stengt} onChange={(e)=>{
                        let detteKlokkeslettet = e.target.value;
                        let klMinutter = minutterFraKlokkeslett(detteKlokkeslettet);

                        if(klMinutter > minutterFraKlokkeslett(dag.open) && klMinutter >= minutterFraKlokkeslett(env.klokkeslett[index].open) && klMinutter <= minutterFraKlokkeslett(env.klokkeslett[index].closed) && klMinutter % 15 === 0){
                            const nyPaaJobb = [...paaJobb];
                            nyPaaJobb[index].closed = detteKlokkeslettet;
                            sPaaJobb(nyPaaJobb);
                        } else {
                            alert("Klokkeslettet må være på riktig format eks.: 08:00, 08:30, 09:00 osv.");
                        }
                    }} type='time' step="1800" min={dag.open} max={env.klokkeslett[index].closed} value={env.klokkeslett[index].stengt?undefined:dag.closed}></input></div>
                </div>
            )
        })}

        <p>Nedenfor krysser du av boksen (slik at den ikke er tom) dersom denne frisøren skal ha administrator-rettigheter og få tilgang til dette panelet.</p>
        <label>Admin tilgang: <input type="checkbox" onChange={(e)=>{
            sAdminTilgang(e.target.checked);
        }}></input> </label>

        <div>
            <button onClick={(e)=>{
                e.preventDefault();
                avbryt();
            }}>
                Avbryt
            </button>
            <button onClick={(e)=>{
                    e.preventDefault();
                    if(frisorTjenester.length > 0 && tlfNyFrisor.length===8 && nyFrisorNavn !== "" && !isNaN(parseInt(tlfNyFrisor)) && bildeAvFrisor !== null){
                        lagre();
                        
                    } else {
                        alert("Ikke riktig format");
                    }
                }}>
                Lagre
            </button>
        </div>
    </div>:
    <button style={{display:"flex", alignItems:"center"}} onClick={(e)=>{
        e.preventDefault();
        sLeggTil(true);

    }}>
        <img className='ikonKnapper' src='leggtil.png' alt='Legg til Frisør'></img>Ny Frisør
    </button>}
    </>
  )
}



export default React.memo(LeggTilFrisor)