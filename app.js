const express=require('express');
const app=express();

app.get('/alive',(req,res)=>{
    res.send('Server is alive');
});

module.exports={app};