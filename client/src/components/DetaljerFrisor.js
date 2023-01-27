import React, {useState} from 'react'

function DetaljerFrisor({env, frisor}){

    const [visDetaljer, sVisDetaljer] = useState(false);
  return (
    <>
    <img src='detaljer.png' style={{height:"100%", cursor:"pointer"}} alt="Detaljer om frisør" onClick={()=>{
        sVisDetaljer(!visDetaljer);
    }}></img>
    
    <div>{frisor.navn}</div>
    {visDetaljer?<div style={{fontSize:"small"}}>Behandlinger: {env.tjenester.filter((tjeneste, index)=>frisor.produkter.includes(index)).map((element)=>(element.navn + ", "))}</div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)