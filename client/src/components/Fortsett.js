import React from 'react'

function Fortsett({displayKomponent, previous, number, disabled}){
    return (
        <div className='fortsett'>
            {number !== 1? <button className='fortsettKnapp' style={{backgroundColor:"rgba(0,0,0,0.25) !important"}} onClick={(e)=>{
                e.preventDefault();
                displayKomponent(previous);
            }} >
                TILBAKE
            </button>:<div></div>}
        
            <button className='fortsettKnapp'  disabled={disabled} onClick={(e)=>{
                e.preventDefault();
                displayKomponent(number);
            }}>FORTSETT</button>

        </div>
    )
}

export default React.memo(Fortsett);