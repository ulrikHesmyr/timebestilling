const jwt = require("jsonwebtoken");

const {ACCESS_TOKEN_KEY} = process.env;

const authorization = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token){
        return res.send({message:"Du må logge inn.", valid:false})
    } else {
        try {
            const data = jwt.verify(token, ACCESS_TOKEN_KEY);
            req.brukernavn = data.brukernavn;
            req.passord = data.passord;
            return next();
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = authorization;