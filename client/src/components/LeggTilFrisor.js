import React, {useState} from 'react'

function LeggTilFrisor({env, updateTrigger, sUpdateTrigger, varsle, lagreVarsel}){

    const [leggtil, sLeggTil] = useState(false);
    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [nyFrisorTittel, sNyFrisorTittel] = useState("");
    const [nyFrisorBeskrivelse, sNyFrisorBeskrivelse] = useState("");
    const [tlfNyFrisor, sTlfNyFrisor] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);
    const [adminTilgang, sAdminTilgang] = useState(false);
    const [preview, setPreview] = useState(null);


    async function lagre(){
        lagreVarsel();
        sLeggTil(false);
        
        
        let formData = new FormData();
        formData.append("uploaded_file", bildeAvFrisor);
        formData.append("nyFrisorNavn", nyFrisorNavn);
        formData.append("nyFrisorTlf", parseInt(tlfNyFrisor));
        formData.append("nyFrisorTjenester", frisorTjenester);
        formData.append("tittel", nyFrisorTittel);
        formData.append("beskrivelse", nyFrisorBeskrivelse);
        const options2 = {
            method:"POST",
            body: formData
        }
        const request2 = await fetch("/env/opprettFrisor", options2);
        const response2 = await request2.json();
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
                body: JSON.stringify(data)
            }
            const request = await fetch("/login/opprettBruker", options);
            const response = await request.json();

            if(response){
                sUpdateTrigger(!updateTrigger);
                setFrisortjenester([]);
                sTlfNyFrisor("");
                sNyFrisorNavn("");
                sNyFrisorBeskrivelse("");
                sNyFrisorTittel("");
                sBildeAvFrisor(null);
                varsle();
            }

        } else {
            alert("Noe gikk galt. Prøv igjen.");
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
        }} type="file" name="uploaded_file"></input> {preview && <img className='frisorbilde' style={{height:"300px"}} alt='Forhåndsvisning av bildet' src={preview}></img>}</label>
        

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