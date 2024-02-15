const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeSchema = new Schema({
    file_name:{
        type:String,
        required:true,
    },
    upload_date:{
        type:Date
    },
    changes:{
        type:String
    },
    user:{
        type:String
    }
});

const Change = mongoose.model('Change', ChangeSchema);
module.exports = Change;