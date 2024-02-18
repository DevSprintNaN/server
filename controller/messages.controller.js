const Project=require('../models/Project.model');
const addMessage=async(req,res)=>{
    try{
        const {projectID, username,text,id} = req.body;
        const project=await Project.findById(projectID);
        if(!project){
            return res.status(400).json({status:"error", message:"Project not found"});
        }
        project.messages.push({id,username,text});
        await project.save();
        res.status(200).json({status:"success", message:"Message added successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const getMessages=async(req,res)=>{
    try{
        const {id} = req.params;
        const project=await Project.findById(id);
        if(!project){
            return res.status(400).json({status:"error", message:"Project not found"});
        }
        res.status(200).json({status:"success", messages:project.messages.filter(message=>message.text!=="")});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

module.exports = {addMessage,getMessages};