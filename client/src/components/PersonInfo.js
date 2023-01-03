import React, {useRef} from 'react'

export default function PersonInfo({navn, telefonnummer, nullstillData, setReservasjon ,setUpdate ,updateDataTrigger, data, sNavn, sTelefonnummer}){
    
    const navnInput = useRef(null);
    const tlfInput = useRef(null);

    //const [navnInputValue, setNavnInputValue] = useState('');

    async function registrerData(){
        console.log(data);
        const request = await fetch('http://localhost:3001/timebestilling/bestilltime', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data)
        });
        const response = await request.json();
        if(response){
            setUpdate(!updateDataTrigger);
            setReservasjon(response.bestiltTime);
            nullstillData();
        }
        console.log(response.bestiltTime);
    }

    return (
        <form>
            <label htmlFor="navn">Navn: <input value={navn} ref={navnInput} type="text" placeholder='Navn Navnesen' name='navn' onChange={(e)=>{
                sNavn(e.target.value);
            }}></input></label>
            
            <label htmlFor="phone">Telefon:<input value={telefonnummer} ref={tlfInput} type="number" name="phone" onChange={(e)=>{
                sTelefonnummer(e.target.value);
            }}></input> </label>
            
            <button onClick={(e)=>{
                e.preventDefault();
                if(tlfInput.current.value.length === 8){
                    registrerData();
                } else {
                    alert("Telefonnumeret er ikke gyldig");
                }
            }}>SEND INN RESERVASJON</button>
        </form>
    )
}