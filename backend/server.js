const express = require("express")
const cors = require("cors");
const axios = require('axios');
const bodyParser = require("body-parser");
var querystring = require('querystring')
require('dotenv').config()
const fetch = (...args) =>{
  import('node-fetch').then(({default:fetch})=> fetch(...args))
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res){
    await axios.post('https://github.com/login/oauth/access_token' ,{code: req.query.code, client_id: process.env.CLIENT_ID , client_secret: process.env.CLIENT_SECRET})
    .then((response) => {
        //轉換資料型態
        access_token = querystring.parse(response.data).access_token
        res.json({
          access_token: access_token
        })
      }).catch(err => console.log(err));
    })

app.listen(4000, () => {
    console.log('CROS server running')
})