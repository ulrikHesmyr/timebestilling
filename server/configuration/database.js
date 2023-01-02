const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.set('strictQuery', true); 

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{console.log("DATABASE connected successfully");}).catch((err)=>{

        console.log("Connection to database failed");
        console.log(err);
        process.exit(1);
    })
}