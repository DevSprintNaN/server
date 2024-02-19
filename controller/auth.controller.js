const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const generateJwt = require('../config/jwt_generator');
const Otp = require('../models/Otp.model');
const passport=require('../config/passport')(require('passport'));
require('dotenv').config();
const SMTPClient = require('../config/smtp');

const checkExistingUser = async(user) => {
    try{
        const newuser = await User.findOne({email: user.email});

        if(newuser){
            return false;
        }else{
            return true;
        }
    }catch(error){
        console.log(error);
        return false;
    }
};

const register = async(req, res) => {
    try{
        const user = req.body;
        if(!checkExistingUser(user)) res.status(400).json({message: "User already exists"});
        else{
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            const newUser = {
                username: user.username,
                email: user.email,
                password: hash
            }
            const createdUser=await User.create(newUser);
            const token=await generateJwt(createdUser,req.headers);
            res.status(200).json({message: "User created successfully", token, user: createdUser});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
};

const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        const user = await User.login(email,password,req.headers);
        res.status(200).json({status:"success", message:"Logged in successfully",...user});
    }
    catch(error){
        console.log(error);
        if(error==="Incorrect password"){
            res.status(401).json({error:error});
        }
        else if(error==="Incorrect email"){
            res.status(401).json({error:error});
        }
        else{
            res.status(500).json({error:error});
        }
    }
};

const validateUser=async(req,res)=>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        else{
            return res.status(200).json({status:"success", message:"User is authenticated"});
        }
      })(req, res);
}

const getUser=async(req,res)=>{
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({status:"error", message: 'Unauthorized' });
        }
        else{
            return res.status(200).json({status:"success", message:"User is authenticated", user});
        }
      })(req, res);
}

const verifyEmail=async(req,res)=>{
    try{
        const user=await User.findOne({email:req.user.email});
        if(user){
            const mailer=new SMTPClient(email);
            const otp=mailer.generateOTP();
            await Otp.create({email,otp});
            mailer.generateMail();
            mailer.sendVerificationMail();
            return res.status(200).json({status:"success"})
        }
        else{
            return res.status(400).json({status:"error",message:"User does not exist"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const verifyOtp=async(req,res)=>{
    try{
        const {email,otp}=req.body;
        const otpDoc=await Otp.findOne({email,otp});
        if(otpDoc){
            const user=await User.findOne({email});
            user.verified=true;
            await user.save();
            await Otp.findOneAndDelete({email,otp});
            return res.status(200).json({status:"success",message:"User verified"});
        }
        else{
            return res.status(400).json({status:"error",message:"Invalid otp"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error",message:"Internal Server Error",status:"error"})
    }
}

const otpForgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});
        if(user){
            const mailer=new SMTPClient(email);
            const otp=mailer.generateOTP();
            await Otp.create({email,otp});
            mailer.generateMail();
            mailer.sendVerificationMail();
            return res.status(200).json({status:"success"});
        }
        else{
            return res.status(400).json({status:"error",message:"User does not exist"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const resetPassword=async(req,res)=>{
    try{
        const {email,otp,password}=req.body;
        const otpDoc=await Otp.findOne({email,otp});
        if(otpDoc){
            const user=await User.findOne({email});
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.password=hash;
            await user.save();
            await Otp.findOneAndDelete({email,otp});
            return res.status(200).json({status:"success",message:"Password reset successfully"});
        }
        else{
            return res.status(400).json({status:"error",message:"Invalid otp"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error",message:"Internal Server Error"})
    }
}


module.exports = {
    register,
    login,
    validateUser,
    getUser,
    verifyEmail,
    verifyOtp,
    otpForgotPassword,
    resetPassword
}
