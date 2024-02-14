const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name:{
        type:String,
        required:true,
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
    projectID:{
        type:String,
        required:true
    }
});
const File = mongoose.model('File',FileSchema)
module.exports = File;