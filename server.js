const express = require("express")
const cors = require("cors");
const axios = require('axios');
const bodyParser = require("body-parser");
var querystring = require('querystring')
// const { response } = require("express");
//const { get } = require("http");
const fetch = (...args) =>{
  import('node-fetch').then(({default:fetch})=> fetch(...args))
}


const CLIENT_ID = '7e2ec405ab8a9a9c9528';
const CLIENT_SECRET = '80611047af1ef4e04888c56710ddd82771f0c116';


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res){
    console.log(req.query.code);
    const parmars = "?client_id="+ CLIENT_ID +"&client_secret="+ CLIENT_SECRET+"&code=" + req.query.code;
    console.log(parmars);
    await axios.post('https://github.com/login/oauth/access_token' ,{code: req.query.code, client_id: CLIENT_ID , client_secret: CLIENT_SECRET})
    .then((response) => {
        //轉換資料型態
        access_token = querystring.parse(response.data).access_token
        res.json({
          access_token: access_token
        })
      }).catch(err => console.log(err));
    })

app.get('/getUserData', async function (req,res){
    await axios.get('https://api.github.com/user', {
        headers:{
            "Authorization": 'Bearer ' + req.get("Authorization").slice(6,)
        }
     })
     .then((response) => {
        res.json({
          UserData: response.data
        })
      }).catch(err =>console.log(err))
})

app.get('/getUserRepo', async function (req,res){
  await axios.get('https://api.github.com/user/repos', {
      headers:{
          "Authorization": 'Bearer ' + req.get("Authorization").slice(6,)
      }
   })
   .then((response) => {
    console.log(response.data)
      res.json({
        RepoData: response.data
      })
    }).catch(err =>console.log(err))
})

app.listen(4000, () => {
    console.log('CROS server running')
})