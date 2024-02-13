const express=require('express');
const app=express();
const passport = require('passport');
const session = require("express-session");
const flash = require('flash');
const cors = require('cors');
require("./config/passport")(passport);
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
});

app.use(limiter);

const corsOptions = {
  origin: ['http://localhost:5713','http://localhost:3000','https://dev--dev-server-projecthub.netlify.app','https://production-projecthub.netlify.app'],
}

app.use(cors(corsOptions));
app.use(
    session({
      secret:process.env._SESSION_SECRET,
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


const fileRoutes = require('./routes/file.routes');
app.use('/file', fileRoutes);

module.exports={app};