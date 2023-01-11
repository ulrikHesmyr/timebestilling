import React, { useState } from 'react'

function RedigerKontakt({setState, state, sendTilDatabase}){


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
        }}><img src='rediger.png' style={{height:"1.4rem"}} alt="Rediger"></img> </button>):""}
        {inputSynlig?(<input value={state} onChange={(e)=>{
            setState(e.target.value);
        }}></input>):""}
        {avbrytOgLagreSynlig?(
            <div>
                
            <button onClick={()=>{
                setState(state);
                sTempState(state);
                sendTilDatabase();
                sAvbrytOgLagreSynlig(false);
                sInputSynlig(false);
                sRedigeringsKnappSynlig(true);
            }}>
                <img src="lagre.png" alt="Lagre og oppdater database"></img>
            </button>
            
            <button onClick={()=>{
                setState(tempState);
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