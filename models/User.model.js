const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const generateJwt = require('../config/jwt_generator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type:String, required:true, unique:true },
    email: {type:String, required:true, unique:true },
    password: {type:String,required:true},
    starred_projects: {type:[String], default:[]},
    projects: {type:[String], default:[]},
    skills: {type:[String], default:[]},
    verified: {type:Boolean, default:false}
});

UserSchema.statics.login=async function(email,password,headers){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            const token=await generateJwt(user,headers);
            return {user,token};
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

UserSchema.statics.comparePassword=async function(user,password){
    const auth = await bcrypt.compare(password, user.password);
    return auth;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;