const logginnButton = document.getElementById("logginn");
const loggUtButton = document.getElementById("loggut");
const sendPINButton = document.getElementById("sendPIN");
const sendPINInput = document.getElementById("sendPINInput");

async function alreadyLoggedIn(){
    const request = await fetch("/login/loggetinn");
    const response = await request.json();
    if(response.valid){
        console.log("Du er logget inn fra før!");
        console.log(response);
    } else {
        console.log("Du er ikke logget inn");
    }
}

alreadyLoggedIn();

async function logginn(){
    const data = {
        brukernavn:"elin",
        passord:"elin"
    }

    const options = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(data),
    }

    const request = await fetch("/login/auth", options);
    const response = await request.json();
    if(response){
        console.log(response);
    }
}

async function loggut(){
    const request = await fetch('/login/logout');
    const response = await request.json();
    console.log(response);
}

async function sendPIN(){
    console.log("sendPIN");
    const data = {
        pin:sendPINInput.value
    }
    const options = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",  
        },
        body: JSON.stringify(data),
    }
    const request = await fetch('/login/TWOFA', options);
    const response = await request.json();
    if(response){
        console.log(response);
    }

}

logginnButton.addEventListener('click',logginn);
loggUtButton.addEventListener('click', loggut);
sendPINButton.addEventListener('click', sendPIN);

