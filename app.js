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
  origin: ['http://localhost:5173','http://localhost:8080','http://localhost:4000','http://localhost:3000','https://dev--dev-server-projecthub.netlify.app','https://production-projecthub.netlify.app','https://realtime-server-production-iiuvnntd4a-uw.a.run.app','https://realtime-server-iiuvnntd4a-uw.a.run.app'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
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

const projectRoutes = require('./routes/project.routes'); 
app.use('/project', projectRoutes);

const messageRoutes = require('./routes/message.routes'); 
app.use('/messaging', messageRoutes);

module.exports={app};