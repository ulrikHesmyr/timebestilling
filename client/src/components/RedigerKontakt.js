import React, { useState } from 'react'

function RedigerKontakt({number, setState, state, sUpdateTrigger, updateTrigger, varsle, lagreVarsel, varsleFeil}){


    const [redigeringsKnappSynlig, sRedigeringsKnappSynlig] = useState(true);
    const [inputSynlig, sInputSynlig] = useState(false);
    const [avbrytOgLagreSynlig, sAvbrytOgLagreSynlig] = useState(false);
    const [tempState, sTempState] = useState(state);


    async function oppdaterEpost(){
        lagreVarsel();
        try {
            const response = await fetch('http://localhost:1226/env/oppdaterEpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({epost: tempState})
            });
            const data = await response.json();
            if(data){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            varsleFeil();
        }
    }

    async function oppdaterTelefonnummer(){
        lagreVarsel();
        try {
            const response = await fetch('http://localhost:1226/env/oppdaterTelefonnummer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({telefonnummer: tempState})
            });
            const data = await response.json();
            if(data){
                varsle();
                sUpdateTrigger(!updateTrigger);
            }
        } catch (error) {
            varsleFeil();
        }
    }

    return(
    <div>
            {redigeringsKnappSynlig?(
        <button className='rediger' onClick={(e)=>{
            e.preventDefault();
            sInputSynlig(!inputSynlig);
            sRedigeringsKnappSynlig(false);
            sAvbrytOgLagreSynlig(true)
        }}><img className='ikonKnapper' src='rediger.png' alt="Rediger"></img></button>):""}
        
        {inputSynlig && avbrytOgLagreSynlig?(<div className='fokus'>
        <h4>Rediger kontakt info:</h4>
        <p>Rediger kontakt-informasjonen som vil være tilgjengelig på "kontakt-oss" siden. 
            Dersom du ønsker å endre telefonnummeret for tofaktor-autoriseringen for admin-brukeren, så ta kontakt</p>
        <label>{number?"Nytt kontaktnummer: ": "Ny kontakt-epost: "}<input type={number?"number":"email"} value={tempState} onChange={(e)=>{
            sTempState(e.target.value);
        }}></input></label>
        
        <div>
                 
            <button onClick={()=>{
                sTempState(state);
                sAvbrytOgLagreSynlig(false);
                sInputSynlig(false);
                sRedigeringsKnappSynlig(true);
            }}>
                Avbryt
            </button>
            <button onClick={(e)=>{
                e.preventDefault();
                setState(tempState);
                sAvbrytOgLagreSynlig(false);
                sInputSynlig(false);
                sRedigeringsKnappSynlig(true);
                //Sjekker om det er telefonnummeret som må oppdateres
                if(number){
                    
                    //Oppdaterer telefonnummeret for salongen
                    oppdaterTelefonnummer(tempState);
                } else {
                    
                    //Oppdaterer eposten for salongen
                    oppdaterEpost(tempState);
                }
            }}>
                Lagre
            </button>
        
        </div>
    </div>
        ):""}
        </div>
    )
}

export default React.memo(RedigerKontakt);