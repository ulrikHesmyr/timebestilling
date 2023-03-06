import React from 'react'

function Fortsett({displayKomponent, previous, number, disabled}){
    return (
        <div className='fortsett'>
            <button className='fortsettKnapp'  disabled={number === 1} onClick={(e)=>{
                e.preventDefault();
                displayKomponent(previous -1);
            }}>TILBAKE</button>
        
            <button className='fortsettKnapp'  disabled={disabled} onClick={(e)=>{
                e.preventDefault();
                displayKomponent(number);
            }}>FORTSETT</button>

        </div>
    )
}

export default React.memo(Fortsett);