import React, {useState} from 'react'


function SMS({env, varsle, lagreVarsel}){

    const [aktivertFeedbackSMS, setAktivertFeedbackSMS] = useState(env.aktivertFeedbackSMS);
    const [aktivertSMSpin, setAktivertSMSpin] = useState(env.aktivertSMSpin);
    async function endreStatusSMSfeedback(nyStatus){
        lagreVarsel();
        const res = await fetch("/env/endreStatusSMSfeedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nyStatus}),
            credentials: 'include'
        });
        const data = await res.json();
        if(data){
            varsle();
            setAktivertFeedbackSMS(nyStatus);
        }
    }

    async function endreStatusSMSpin(nyStatus){
        lagreVarsel();
        const res = await fetch("/env/endreStatusSMSpin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nyStatus}),
            credentials: 'include'
        });
        const data = await res.json();
        if(data){
            varsle();
            setAktivertSMSpin(nyStatus);
        }
    }

  return (
    <div className='SMSside'>
        <div>
            <h4>SMS /m google review link</h4>
            <p>SMS sendes ut til alle kunder samme dag som besøket</p>
            <div className='SMSkonfigBoks'>
                SMS med google review link: <StatusMelding funksjon={endreStatusSMSfeedback} status={aktivertFeedbackSMS}/>
            </div>
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