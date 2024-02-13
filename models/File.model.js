const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeSchema = new Schema({
    added: {
        type: [String], 
        default: []
    },
    removed: {
        type: [String], 
        default: []
    }
});


const FileSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    users:{
        type:[String]
    },
    files:{
        type:[String]
    },
    upload_date:{
        type:[Date],
    },
    fileType:{
        type:[String]
    },
    changes:{
        type:[ChangeSchema]
    }
});
const File = mongoose.model('File',FileSchema)
module.exports = File;