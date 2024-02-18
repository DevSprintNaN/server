const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
    skill:{
        type:String,
        required:true,
        unique:true
    }
});

const Skills = mongoose.model('Skill', SkillSchema);
module.exports = Skills;