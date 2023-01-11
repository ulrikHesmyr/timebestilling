import React, { useState } from "react";

function RedigerPassord({state, setState, sendTilDatabase}){

    const [redigeringsKnappSynlig, sRedigeringsKnappSynlig] = useState(true);
    const [inputSynlig, sInputSynlig] = useState(false);
    const [avbrytOgLagreSynlig, sAvbrytOgLagreSynlig] = useState(false);

    const [nyttPassord, sNyttPassord] = useState("");
    const [gjentaPassord, sGjentapassord] = useState("");
    const [toggleViewPassord, sToggleView] = useState(false);
    const [toggleViewPassordGjentagelse, sToggleViewG] = useState(false);
    return(
        <>
            {redigeringsKnappSynlig?(<button className='rediger' onClick={(e)=>{
            e.preventDefault();
            sRedigeringsKnappSynlig(false);
        }}><img src='rediger.png' style={{height:"1.4rem"}} alt="Rediger"></img> </button>):(<div>
            <label>Nytt passord: <input value={nyttPassord} type={(toggleViewPassord?"text":"password")} onChange={(e)=>{
                sNyttPassord(e.target.value);
            }}></input> <input checked={toggleViewPassord} type="checkbox" onChange={()=>{
                sToggleView(!toggleViewPassord);
            }}></input> </label>
            <label>Nytt passord: <input value={gjentaPassord} type={(toggleViewPassordGjentagelse?"text":"password")} onChange={(e)=>{
                sGjentapassord(e.target.value);
            }}></input> <input checked={toggleViewPassordGjentagelse} type="checkbox" onChange={()=>{
                sToggleViewG(!toggleViewPassordGjentagelse)
            }}></input> </label>
            <button onClick={(e)=>{
                e.preventDefault();
                if(nyttPassord === gjentaPassord){
                    setState(nyttPassord);
                    sRedigeringsKnappSynlig(true);
                    sNyttPassord("");
                    sGjentapassord("");
                } else {
                    alert("Passord ikke like");
                }

            }}>
                <img style={{height:"1.4rem"}} src="lagre.png" alt="Lagre passord og send til database"></img> 
            </button>
            <button onClick={(e)=>{
                e.preventDefault();
                setState(state);
                sRedigeringsKnappSynlig(true);
                sNyttPassord("");
                sGjentapassord("");
            }}>
                <img style={{height:"1.4rem"}} src="avbryt.png" alt="Avbryt endringer og behold gammelt passord"></img>
            </button>
        </div>)}
            
        </>
    )
}

export default React.memo(RedigerPassord);