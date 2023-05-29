const nodemailer = require("nodemailer");

function sendMail(subject, message, mailAddress = process.env.PERSONAL_ADDR){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        secure:true,
        auth:{
            user:process.env.MAIL_ADDR,
            pass:process.env.MAIL_PASS
        }
    })
    transporter.sendMail({
        to: mailAddress,
        subject:subject,
        html: `${message.split("\n").join("<br>")}`

    }, (err)=>{
        if(err){
            console.log(err);
        } else {
            if(process.env.NODE_ENV === "development"){
                console.log("Email sent");
            }
        }
    })
}
exports.sendMail = sendMail;