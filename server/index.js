const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./configuration/database").connect();
app.use(express.json());
app.use(cors());

app.use('/timebestilling', require('./routes/timebestilling'));
app.use('/login', require('./routes/login'));

app.listen(process.env.SERVERPORT, () => {
  console.log(`Server listening on port ${process.env.SERVERPORT}`);
});
