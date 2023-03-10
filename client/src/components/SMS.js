import React, {useState} from 'react'


function SMS({env}){

    const [aktivertFeedbackSMS, setAktivertFeedbackSMS] = useState(env.aktivertFeedbackSMS);
  return (
    <div className='SMSside'>
        <div className='SMSkonfigBoks'>
            SMS med google review link: <StatusMelding status={aktivertFeedbackSMS}/>
        </div>
    </div>
  )
}

function StatusMelding({status}){
    return(
        <div className='statusMelding' style={status?{color:"green"}:{color:"red"}}>
            {status?" AKTIVERT":" DEAKTIVERT"}
        </div>
    )
}

export default React.memo(SMS)