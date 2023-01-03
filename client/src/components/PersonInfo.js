import React, {useRef} from 'react'

export default function PersonInfo({isMobile, synligKomponent, displayKomponent, navn, telefonnummer, nullstillData, setReservasjon ,setUpdate ,updateDataTrigger, data, sNavn, sTelefonnummer}){
    
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
            displayKomponent(0);

        }
        console.log(response.bestiltTime);
    }

    return (
        <div className={synligKomponent === 4? 'animer-inn':'animer-ut'}>
            <form>
                <label htmlFor="navn">Navn: <input value={navn} ref={navnInput} type="text" placeholder='Navn Navnesen' name='navn' onChange={(e)=>{
                    sNavn(e.target.value);
                }}></input></label>

                <label htmlFor="phone">Telefon:<input value={telefonnummer} ref={tlfInput} type="text" name="phone" onChange={(e)=>{
                    const newValue = e.target.value;
                    if(/^\d*$/.test(newValue)){
                        sTelefonnummer(newValue);
                    }
                }}></input> </label>

                {isMobile?"h":""}
                <button onClick={(e)=>{
                    e.preventDefault();
                    if(telefonnummer.length === 8){
                        registrerData();
                    } else {
                        alert("Telefonnumeret er ikke gyldig");
                    }
                }}>SEND INN RESERVASJON</button>
            </form>
        </div>
    )
}