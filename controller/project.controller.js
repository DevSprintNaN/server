const Project=require('../models/Project.model');
const User=require('../models/User.model');

const createProject = async(req, res) => {
    try{
        const user = req.user;
        const {name} = req.body;
        const userName=(await User.findById(user._id)).username;
        const existingProject=await Project.findOne({name,owner:user._id});
        if(existingProject){
            return res.status(400).json({status:"error", message:"Project already exists"});
        }
        const project = new Project({
            name,
            owner:user._id,
            ownerName:userName,
            users:[userName],
            userIds:[user._id]
        });
        await project.save();
        const userToUpdate=await User.findById(project.owner);
        userToUpdate.projects.push(project._id);
        await userToUpdate.save();
        res.status(200).json({status:"success", message:"Project created successfully", project});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const getProjects=async(req,res)=>{
    try{
        const user = req.user;
        const projects = await Project.find({userIds:user._id});
        res.status(200).json({status:"success", projects});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const getAllProjects=async(req,res)=>{
    try{
        const projects = await Project.find({});
        res.status(200).json({status:"success", projects});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}


module.exports = {createProject,getProjects,getAllProjects};