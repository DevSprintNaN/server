const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    users:{
        type:[String]
    },
    userIds:{
        type:[String]
    },
    fileId:{
        type:[String],
        default:[]
    },
    contents:{
        type:[String],
        default:[]
    },
    creationDate:{
        type:String,
        default:(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()
    },
    lastModified:{
        type:String,
        default:(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()
    },
    messages:{
        type:[{
            id:{
                type:String,
                required:true
            },
            username:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            },
            date:{
                type:String,
                default:(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()
            }
        }],
        default:[]
    },
    stars:{
        type:Number,
        default:0
    }
});
const Project = mongoose.model('Project',ProjectSchema)
module.exports = Project;