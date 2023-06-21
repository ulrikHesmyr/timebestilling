import React, {useState} from 'react'


function SMS({env, varsle, lagreVarsel, varsleFeil, sUpdateTrigger, updateTrigger}){

    const [aktivertFeedbackSMS, setAktivertFeedbackSMS] = useState(env.aktivertFeedbackSMS);
    const [aktivertSMSpin, setAktivertSMSpin] = useState(env.aktivertSMSpin);
    const [aktivertTimebestilling, sAktivertTimebestilling] = useState(env.aktivertTimebestilling);
    //Google review link
    const [visRedigerGoogleReviewLink, sVisRedigerGoogleReviewLink] = useState(false);
    const [googleReviewLink, sGoogleReviewLink] = useState(env.googleReviewLink);
    
    async function oppdaterGoogleReviewLink(){
        try {
            lagreVarsel();
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({googleReviewLink:googleReviewLink}),
            //credentials:'include'
        }
        const request = await fetch("http://localhost:1228/env/oppdaterGoogleReviewLink", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();      
        }
    }
    async function endreStatusSMSfeedback(nyStatus){
        try {
            lagreVarsel();
        const res = await fetch("http://localhost:1228/env/endreStatusSMSfeedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nyStatus}),
            //credentials: 'include'
        });
        const data = await res.json();
        if(data){
            setAktivertFeedbackSMS(nyStatus);
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();   
        }
    }

    async function endreAktivertTimebestilling(nyStatus){
        try {
            lagreVarsel();
        const res = await fetch("http://localhost:1228/env/endreAktivertTimebestilling", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({aktivert: nyStatus}),
            //credentials: 'include'
        });
        const data = await res.json();
        if(data){
            sAktivertTimebestilling(nyStatus);
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();   
        }
    }

    async function endreStatusSMSpin(nyStatus){
        try {
            lagreVarsel();
        const res = await fetch("http://localhost:1228/env/endreStatusSMSpin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            //credentials: 'include',
            body: JSON.stringify({nyStatus})
        });
        const data = await res.json();
        if(data){
            setAktivertSMSpin(nyStatus);
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
            varsleFeil();   
        }
    }

  return (
    <div className='SMSside'>
        
        <div>
            <h4>Timebestilling</h4>
            <p>Velg om du vil ha timebestilling for din nettside aktivert eller deaktivert. Når den er aktivert, vil folk kunne bestille time. Dersom timebestilling er deaktivert, vil man ikke lenger kunne bestille time, men timer som er bestilt fra før, vil fortsatt ligge i systemet og må gjennomføres.</p>
            <div className='SMSkonfigBoks'>
                Timebestilling: <StatusMelding funksjon={endreAktivertTimebestilling} status={aktivertTimebestilling}/>
            </div>
        </div>
        <div>
            <h4>SMS /m google review link</h4>
            <p>SMS sendes ut til alle kunder samme dag som besøket</p>
            <div className='SMSkonfigBoks'>
                SMS med google review link: <StatusMelding funksjon={endreStatusSMSfeedback} status={aktivertFeedbackSMS}/>
            </div>
        </div>
        
        <div className='redigeringsBoks'> 
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            {visRedigerGoogleReviewLink?<div>
                                <div className='fokus'>
                                    <h4>Rediger google review link</h4>
                                    <p>
                                        Her kan du redigere linken til google reviews. Denne linken sendes pr SMS til kunder samme kveld som deres besøk.
                                    </p>
                                    <p>Nåværende link: {env.googleReviewLink}</p>
                                    <label>Link: <input type="url" value={googleReviewLink} onChange={(e)=>{
                                        sGoogleReviewLink(e.target.value);
                                    }}></input></label>
                                    <div>
                                    <button onClick={()=>{
                                        
                                        sVisRedigerGoogleReviewLink(false); 
                                        sGoogleReviewLink(env.googleReviewLink);
                                    }}>Avbryt</button>
                                    <button onClick={()=>{
                                        sVisRedigerGoogleReviewLink(false); 
                                        oppdaterGoogleReviewLink();
                                    }}>Lagre</button>    
                                    </div>
                                </div>
                            </div> :<button className='rediger' onClick={(e)=>{
                                sVisRedigerGoogleReviewLink(true);
                                }}><img className='ikonKnapper' src='rediger.png' alt="Rediger"></img></button>}
                            <div>Rediger google review link: </div>
                        </div>
                        <p className='redigeringsElement'>{googleReviewLink}</p>
                    </div>

        <div>
            <h4>SMS-PIN for timebestilling</h4>
            <p>Første gang en kunde bestiller time, så får kunden tilsendt en PIN-kode
                som må skrives inn for å bekrefte bestillingen. Dette er for å hindre spam og at andre kan bestille time på
                kundens telefonnummer. PIN-koden sendes ut som en SMS til kunden. Etter at kunden har gjort dette én gang, så
                vil ikke kunden behøve å gjøre dette igjen så sant det bestilles fra samme enhet og nettleser. Dersom kunden bestillinger
                fra en annen enhet, (for eksempel på PCen til en venn), så vil kunden få tilsendt en ny PIN-kode.
            </p>
            <div className='SMSkonfigBoks'>
                SMS-PIN: <StatusMelding funksjon={endreStatusSMSpin} status={aktivertSMSpin}/>
            </div>
        </div>
    </div>
  )
}

function StatusMelding({status, funksjon}){
    
    return(
        <>
        <div className='statusMelding' style={status?{color:"green"}:{color:"red"}}>
            {status?" AKTIVERT":" DEAKTIVERT"}
        </div> 

        <button onClick={()=>{
            if(window.confirm(`Er du sikker på at du vil ${(status?"deaktivere":"aktivere")}?`)){
                funksjon(!status);
            }
        }} >{status?"deaktiver":"aktiver"}</button>
        </>
        
    )
}

export default React.memo(SMS)