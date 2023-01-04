const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMail(subject, message){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        secure:false,
        auth:{
            user:process.env.MAIL_ADDR,
            pass:process.env.MAIL_PASS
        }
    })
    console.log("hei", process.env.PERSONAL_ADDR);
    transporter.sendMail({
        to: process.env.PERSONAL_ADDR,
        subject:subject,
        html: `<p>${message}</p>`

    }, (err)=>{
        if(err){
            console.log(err);
        } else {
            console.log("Email sent");
        }
    })
}
exports.sendMail = sendMail;