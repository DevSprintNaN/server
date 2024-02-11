const express=require('express');
const app=express();
const passport = require('passport');
const session = require("express-session");
const flash = require('flash');
require("./config/passport")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
      secret:"secret",
      resave: false,  
      saveUninitialized: false, 
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/alive',(req,res)=>{
    res.send('Server is alive');
});

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes)


module.exports={app};