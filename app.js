const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const swaggerUI=require('swagger-ui-express');
const swaggerJsDoc=require('swagger-jsdoc');
const options=require('./swaggerDoc.json');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

let token=null;
let data=null;

app.post("/signUp",(req,res)=>{
    if(!token && !data){
        const payload=req.body;
        console.log(payload);
        if(!payload.lastName){
            res.send(JSON.stringify({error:'please enter last Name'})); 
            return;
        }
        token=payload.lastName+'_'+((Math.random()+1)*1000);
        payload.accessToken=token;
        payload.status='successfully signed Up! Hit the access-token in get profile to fetch';
        data=payload;
        res.send(payload) ;
    }
    else{
        const error={
            message:"already SignedUp by a profile with below accessToken!!, use that accessToken in getProfile API or clear the data before new register ",
            accessToken:token
        }
        console.log(error);
        res.send(error);
    }
})

app.get('/getProfile',(req,res)=>{
    console.log(req.headers);
    if(req.headers.accesstoken===token){
        console.log('token Matched!! ',req.headers.accesstoken,token);
        res.send(data);
    }
    else{
        console.log('token not matched! ',req.headers.accesstoken,token);
        const error={
            errorCode:500,
            errorMessage:'Token not matched!!'
        }
        res.send(error);
    }
})

app.delete("/clearData",(req,res)=>{
    let resp={};
    if(req.headers.accesstoken===token){
        token=null;
        data=null;
        resp.message="Datas has been cleared!! pls signUp";
    }
    else{
        resp.message="Wrong accessToken entered."
    }
  res.send(resp);
})


options.apis=['./app.js'];
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(options)));

app.listen(3000,()=>console.log('server Started at Post 3000'));