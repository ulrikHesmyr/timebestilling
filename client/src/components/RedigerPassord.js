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
        }}><img className='ikonKnapper' src='rediger.png' alt="Rediger"></img></button>):(
        
        <div className="passordBoks fokus">
            <label style={{display:"flex", flexDirection:"column"}}>Nytt administrator passord:
                <div>
                    <input value={nyttPassord} type={(toggleViewPassord?"text":"password")} onChange={(e)=>{
                        sNyttPassord(e.target.value);
                    }}></input> 

                    {(toggleViewPassord?<img onClick={()=>{
                        sToggleView(false);
                        }} src='oye_lukket.png' style={{height:"1.4rem"}} alt="Skjul passord"></img>:<img onClick={()=>{
                            sToggleView(true);
                        }} src='oye_aapnet.png' style={{height:"1.4rem"}} alt="Vis passord"></img>
                    )}
                </div>
            </label>

            <label style={{display:"flex", flexDirection:"column"}}>Gjenta nytt passord: 
                <div> 
                    <input value={gjentaPassord} type={(toggleViewPassordGjentagelse?"text":"password")} onChange={(e)=>{
                        sGjentapassord(e.target.value);
                    }}></input> 

                
                    {(toggleViewPassordGjentagelse?<img onClick={()=>{
                        sToggleViewG(false);
                        }} src='oye_lukket.png' style={{height:"1.4rem"}} alt="Skjul passord"></img>:<img onClick={()=>{
                            sToggleViewG(true);
                        }} src='oye_aapnet.png' style={{height:"1.4rem"}} alt="Vis passord"></img>
                    )}
                </div> 
            </label>

            <div>
                <button onClick={(e)=>{
                    e.preventDefault();
                    sRedigeringsKnappSynlig(true);
                    sNyttPassord("");
                    sGjentapassord("");
                }}>
                    Avbryt
                </button>
                <button onClick={(e)=>{
                e.preventDefault();
                if(nyttPassord === gjentaPassord){
                    sRedigeringsKnappSynlig(true);
                    sNyttPassord("");
                    sGjentapassord("");
                    redigerPassordDB(nyttPassord);
                } else {
                    alert("Passord ikke like");
                }

                }}>Lagre</button>
            
            </div>
        </div>)}
            
        </>
    )
}

export default React.memo(RedigerPassord);