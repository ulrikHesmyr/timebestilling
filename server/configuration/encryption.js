const crypto = require("crypto");
const { ALGORITHM, IVSTRING, PWKEY } = process.env;

const textEncoder = new TextEncoder();
const initVector = textEncoder.encode(IVSTRING);
const Securitykey = textEncoder.encode(PWKEY);


function krypter(message){
    
    // the cipher function
    const cipher = crypto.createCipheriv(ALGORITHM, Securitykey, initVector);

    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    return encryptedData;
}


function dekrypter(encryptedData){

    const decipher = crypto.createDecipheriv(ALGORITHM, Securitykey, initVector);

    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    
    decryptedData += decipher.final("utf8");

    return decryptedData;
}

exports.krypter = krypter;
exports.dekrypter = dekrypter;