const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    }
});

const Otp = mongoose.model('Otp', OTPSchema);
module.exports = Otp;