const uploadFile = require('../config/cloudinary');
const Forum=require('../models/Forum.model');

const addToForum=async(req,res)=>{
    try{
        const {title,description,content}=req.body;
        const image=req.file;
        const result=await uploadFile(new Date(),req.user,image);
        const forum=new Forum({
            title,
            content,
            description,
            cover_image:result.secure_url,
            author:req.user.username
        })
        await forum.save();
        return res.status(200).json({status:"success",_id:forum._id})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error})
    }
}

const getAllForumPosts=async(req,res)=>{
    try{
        const forumPosts=await Forum.find().select('_id title cover_image author description');
        return res.status(200).json({status:"success",posts:forumPosts});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error})
    }
}

const getForumData=async(req,res)=>{
    try{
        const {id}=req.params;
        const forum=await Forum.findById(id);
        return res.status(200).json({status:"success",forum});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error})
    
    }
}

const addAttachmentsToForum=async(req,res)=>{
    try{
        const {id}=req.body;
        const forum=await Forum.findById(id);
        const result=await uploadFile(new Date(),req.user,req.file);
        forum.attachments.push({
            name:req.file.originalname,
            url:result.secure_url,
            fileType:result.format
        });
        await forum.save();
        return res.status(200).json({status:"success"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

module.exports={addToForum,getAllForumPosts,addAttachmentsToForum,getForumData}