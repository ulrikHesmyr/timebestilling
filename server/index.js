const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./configuration/database").connect();
app.use(express.json());
app.use(cors());

//app.use('/timebestilling', require(feks "'./routes/timebestilling'")) og så 

app.post('/api/bestilltime', async (req,res)=>{
    console.log(req.body);
    res.json({ok:process.env.MELDING});
})

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(process.env.SERVERPORT, () => {
  console.log(`Server listening on port ${process.env.SERVERPORT}`);
});
