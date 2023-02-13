import React, { useState } from "react";

function RedigerPassord({redigerPassordDB}){

    const [redigeringsKnappSynlig, sRedigeringsKnappSynlig] = useState(true);

    const [nyttPassord, sNyttPassord] = useState("");
    const [gjentaPassord, sGjentapassord] = useState("");
    const [toggleViewPassord, sToggleView] = useState(false);
    const [toggleViewPassordGjentagelse, sToggleViewG] = useState(false);
    return(
        <>
            {redigeringsKnappSynlig?(<button className='rediger' onClick={(e)=>{
            e.preventDefault();
            sRedigeringsKnappSynlig(false);
        }}><img src='rediger.png' style={{height:"1.4rem"}} alt="Rediger"></img></button>):(
        
        <div className="passordBoks fokus">
            <label>Nytt administrator passord:<div><p className="litentekst">vis passord</p> <input checked={toggleViewPassord} type="checkbox" onChange={()=>{
                sToggleView(!toggleViewPassord);
            }}></input><input value={nyttPassord} type={(toggleViewPassord?"text":"password")} onChange={(e)=>{
                sNyttPassord(e.target.value);
            }}></input> </div> </label>
            <label>Gjenta nytt passord: <div> <p className="litentekst">vis passord</p> 
            <input checked={toggleViewPassordGjentagelse} type="checkbox" onChange={()=>{
                sToggleViewG(!toggleViewPassordGjentagelse)
            }}></input><input value={gjentaPassord} type={(toggleViewPassordGjentagelse?"text":"password")} onChange={(e)=>{
                sGjentapassord(e.target.value);
            }}></input> 
                </div> </label>
            <div><button onClick={(e)=>{
                e.preventDefault();
                if(nyttPassord === gjentaPassord){
                    sRedigeringsKnappSynlig(true);
                    sNyttPassord("");
                    sGjentapassord("");
                    redigerPassordDB(nyttPassord);
                } else {
                    alert("Passord ikke like");
                }

            }}>
                Lagre 
            </button>
            <button onClick={(e)=>{
                e.preventDefault();
                sRedigeringsKnappSynlig(true);
                sNyttPassord("");
                sGjentapassord("");
            }}>
                Avbryt
            </button></div>
        </div>)}
            
        </>
    )
}

export default React.memo(RedigerPassord);