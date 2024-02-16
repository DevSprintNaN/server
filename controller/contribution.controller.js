const Project = require('../models/Project.model');
const {constructChanges} = require('./file.controller');
const User = require('../models/User.model');

const getContributors = async (req, res) => {
    try {
        const projectID = req.params.projectID;
        const project = await Project.findById(projectID);
        return res.status(200).json({status:"success", data:{userId:project.userIds,files:project.fileId}});

    } catch (error) {
        console.log(error);
        return res.status(500).json({status:"failed", error:error});
    }
};

const getContributorById = async(req, res)=>{
    try{
        const userId = req.params.id;
        const username = await User.findById(userId);
        return res.status(200).json({status:"success", user:username});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:"failed", error:error});
    }
}

module.exports = {
    getContributors,
    getContributorById
};