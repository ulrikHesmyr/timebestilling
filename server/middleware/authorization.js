const jwt = require("jsonwebtoken");
const Brukere = require("../model/brukere");

const {ACCESS_TOKEN_KEY, NODE_ENV} = process.env;

const authorization = async (req,res,next) => {
    if(NODE_ENV === "production"){
        const token = req.cookies.access_token;
        if(!token){
            return res.send({message:"Du må logge inn.", valid:false})
        } else {
            try {
                const data = jwt.verify(token, ACCESS_TOKEN_KEY);
                const funnetBruker = await Brukere.findOne({brukernavn: data.brukernavn});
                if(funnetBruker && funnetBruker.passord === data.passord){

                    req.brukernavn = data.brukernavn;
                    req.passord = data.passord;
                
                    return next();
                } else {
                    return res.send({message:"Ikke autorisert", valid:false});
                }
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        req.brukernavn = "admin";
        return next();
        
    }

}

module.exports = authorization;