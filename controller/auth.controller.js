const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
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

            await User.create(newUser);

            res.status(200).json({message: "User created successfully"});
        }    

    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
};

const login = async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (!user) {
            return res.status(401).json({ status: "error", message: info.message });
        }
        
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: err.message });
            }
            return res.status(200).json({ status: "success", message: "Login successful", user: user });
        });
    })(req, res, next);
};

const logout = async(req, res) =>{
    req.logout(function(err) {
        if (err) { 
            console.log(err);
            res.status(500).json({status:"error", error:err});
        }else{
            res.status(200).json({status:"success", message:"Logged out successfully"});
        }
      });
};

module.exports = {
    register,
    login,
    logout
}
