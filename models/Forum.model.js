const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    cover_image:{
        type:String,
        required:true
    },
    attachments:{
        type:[{
            name:String,
            url:String,
            fileType:String
        }],
        default:[]
    },
    uploadDate:{
        type:Date,
        default:new Date()
    },
    upvotes:{
        type:Number,
        default:0
    },
    downvotes:{
        type:Number,
        default:0
    }

});

const Forum = mongoose.model('Forum', ForumSchema);
module.exports = Forum;