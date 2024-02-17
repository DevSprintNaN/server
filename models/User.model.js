const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type:String, required:true, unique:true },
    email: {type:String, required:true, unique:true },
    password: {type:String,required:true},
    starred_projects: {type:[String], default:[]},
    projects: {type:[String], default:[]}
});

const User = mongoose.model('User', UserSchema);
module.exports = User;