import React, { useState } from 'react'

function RedigerKontakt({number, setState, state, sendTilDatabase, env}){


    const [redigeringsKnappSynlig, sRedigeringsKnappSynlig] = useState(true);
    const [inputSynlig, sInputSynlig] = useState(false);
    const [avbrytOgLagreSynlig, sAvbrytOgLagreSynlig] = useState(false);
    const [tempState, sTempState] = useState(state);

    return(
        <div>
            {redigeringsKnappSynlig?(
        <button className='rediger' onClick={(e)=>{
            e.preventDefault();
            sInputSynlig(!inputSynlig);
            sRedigeringsKnappSynlig(false);
            sAvbrytOgLagreSynlig(true)
        }}><img src='rediger.png' style={{height:"1.4rem"}} alt="Rediger"></img>Rediger kontakt-info </button>):""}
        {inputSynlig?(<input type={number?"number":"text"} value={tempState} onChange={(e)=>{
            sTempState(e.target.value);
        }}></input>):""}
        {avbrytOgLagreSynlig?(
            <div>
                
            <button onClick={(e)=>{
                e.preventDefault();
                setState(tempState);
                sAvbrytOgLagreSynlig(false);
                sInputSynlig(false);
                sRedigeringsKnappSynlig(true);
                //Sjekker om det er telefonnummeret som må oppdateres
                if(number){
                    sendTilDatabase(env.frisorer, env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, tempState);
                } else {
                    sendTilDatabase(env.frisorer, env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, tempState, env.kontakt_tlf);
                }
            }}>
                <img src="lagre.png" alt="Lagre og oppdater database"></img>
            </button>
            
            <button onClick={()=>{
                sTempState(state);
                sAvbrytOgLagreSynlig(false);
                sInputSynlig(false);
                sRedigeringsKnappSynlig(true);
            }}>
                <img src="avbryt.png" alt="Avbryt endringer"></img>
            </button>
            
            </div>
        ):""}
        </div>
    )
}

export default React.memo(RedigerKontakt);