const logginnButton = document.getElementById("logginn");
const loggUtButton = document.getElementById("loggut");

async function alreadyLoggedIn(){
    const request = await fetch("/login/loggetinn");
    const response = await request.json();
    if(response.valid){
        console.log("Du er logget inn fra før!");
    } else {
        console.log("Du er ikke logget inn");
    }
}

alreadyLoggedIn();

async function logginn(){
    const data = {
        brukernavn:"vakter",
        passord:"DronningSonja"
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
    console.log(options.body);
    console.log(response);
}

async function loggut(){
    const request = await fetch('/login/logout');
    const response = await request.json();
    console.log(response);
}

logginnButton.addEventListener('click',logginn);
loggUtButton.addEventListener('click', loggut);