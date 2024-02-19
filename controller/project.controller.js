const Project=require('../models/Project.model');
const User=require('../models/User.model');

const createProject = async(req, res) => {
    try{
        const user = req.user;
        const {name,content} = req.body;
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
            contents:content,
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
        const projects = await Project.find({}).sort({stars:-1}).limit(100);
        res.status(200).json({status:"success", projects});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const getProject=async(req,res)=>{
    try{
        const {id} = req.params;
        const project=await Project.findById(id);
        if(!project){
            return res.status(400).json({status:"error", message:"Project not found"});
        }
        res.status(200).json({status:"success", project});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}


const starProject=async(req,res)=>{
    try{
        const {id} = req.body;
        const project=await Project.findById(id);
        if(!project){
            return res.status(400).json({status:"error", message:"Project not found"});
        }
        project.stars=project.stars+1;
        await project.save();
        const user=await User.findById(req.user._id);
        user.starred_projects.push(id);
        await user.save();
        res.status(200).json({status:"success", message:"Project starred successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const unstarProject=async(req,res)=>{
    try{
        const {id} = req.body;
        const project=await Project.findById(id);
        if(!project){
            return res.status(400).json({status:"error", message:"Project not found"});
        }
        project.stars=project.stars-1;
        await project.save();
        const user=await User.findById(req.user._id);
        user.starred_projects=user.starred_projects.filter(project=>project!==id);
        await user.save();
        res.status(200).json({status:"success", message:"Project unstarred successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const isProjectStarred=async(req,res)=>{
    try{
        const {id} = req.params;
        const user=await User.findById(req.user._id);
        const isStarred=user.starred_projects.includes(id);
        res.status(200).json({status:"success", isStarred});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const numberOfContributorsPerProject=async(req,res)=>{
    try{
        const projects=await Project.find({}).sort({stars:-1}).limit(100);
        const contributors=[];
        projects.forEach((project)=>{
            contributors.push(project.users.length);
        })
        return res.status(200).json({status:"success", contributors});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}

const numberOfStarsPerProject=async(req,res)=>{
    try{
        const projects=await Project.find({}).sort({stars:-1}).limit(100);
        const stars=[];
        projects.forEach((project)=>{
            stars.push(project.stars);
        })
        return res.status(200).json({status:"success", stars});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}

module.exports = {createProject,getProjects,getAllProjects,starProject,unstarProject,getProject,isProjectStarred,numberOfContributorsPerProject,numberOfStarsPerProject};