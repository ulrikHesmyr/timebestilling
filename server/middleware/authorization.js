const jwt = require("jsonwebtoken");
const Brukere = require("../model/brukere");

const {ACCESS_TOKEN_KEY, NODE_ENV, PASSORD_KEY} = process.env;

const authorization = async (req,res,next) => {
    try {
        
        if(NODE_ENV === "production"){
            const token = req.cookies.access_token;
            if(!token){
                return res.send({message:"Du må logge inn.", valid:false})
            } else {
                const data = jwt.verify(token, ACCESS_TOKEN_KEY);
                let accessPassord = jwt.verify(data.passord, PASSORD_KEY);
                const funnetBruker = await Brukere.findOne({brukernavn: data.brukernavn});
                let passordet = jwt.verify(funnetBruker.passord, PASSORD_KEY);
                if(funnetBruker && passordet === accessPassord){
                    req.brukernavn = data.brukernavn;
                    req.admin = funnetBruker.admin;
                    req.brukertype = data.brukertype;
                    return next();
                } else {
                    return res.send({message:"Ikke autorisert", valid:false});
                }
            }
        } else {
            req.admin = true;
            req.brukernavn = "admin";
            req.brukertype = "admin";
            return next();

        }
    } catch (error) {
        console.log(error, "ERROR I AUTHORIZATION.JS");
    }

}


module.exports = authorization;