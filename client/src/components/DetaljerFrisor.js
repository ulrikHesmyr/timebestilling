import React, {useState, useEffect} from 'react'

function DetaljerFrisor({env, frisor}){

    const [visDetaljer, sVisDetaljer] = useState(false);

    
    const [frisorBilde, sFrisorBilde] = useState(null);
    useEffect(()=>{
        
      const base = window.btoa(String.fromCharCode.apply(null, new Uint8Array(frisor.img.data.data)));
      const base64Image = `data:${frisor.img.contentType};base64,${base}`;
      sFrisorBilde(base64Image);
    }, [])
  return (
    <>
    <img src='detaljer.png' style={{height:"100%", cursor:"pointer"}} alt="Detaljer om frisør" onClick={()=>{
        sVisDetaljer(!visDetaljer);
    }}></img>
    <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
    <img src={frisorBilde} style={{height:"1.6rem"}} alt={`Bilde av ${frisor.navn}`}></img>
    
    

    {visDetaljer?<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <div style={{fontSize:"small"}}>
      Behandlinger: {env.tjenester.length === frisor.produkter.length?"Alle":env.tjenester.filter((tjeneste, index)=>frisor.produkter.includes(index)).map((element)=>(element.navn + ", "))}
      </div>
      <div>{frisor.oppsigelse !== "Ikke oppsagt"?`Dato for oppsigelse: ${frisor.oppsigelse}`:""}</div>
      
    </div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)