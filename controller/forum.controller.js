const uploadFile = require('../config/cloudinary');
const Forum=require('../models/Forum.model');
const User = require('../models/User.model');

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
        const forumPosts=await Forum.find().sort({upvotes:-1}).sort({downvotes:1}).select('_id title cover_image author description uploadDate');
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
            fileType:result.format===null||result.format===undefined?"null":result.format
        });
        await forum.save();
        return res.status(200).json({status:"success"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const upvote=async(req,res)=>{
    try{
        const {id}=req.body;
        const user=await User.findById(req.user._id);
        if(user.upvotes!==undefined && user.upvotes.includes(id)){
            user.upvotes=user.upvotes.filter((item)=>item!==id);
            await user.save();
            const forum=await Forum.findById(id);
            forum.upvotes-=1;
            await forum.save();
        }
        else{
            if(user.downvotes!==undefined && user.downvotes.includes(id)){
                user.downvotes=user.downvotes.filter((item)=>item!==id);
                await user.save();
                const forum=await Forum.findById(id);
                forum.downvotes-=1;
                await forum.save();
            }
            if(user.upvotes===undefined){
                user.upvotes=[];
            }
            user.upvotes.push(id);
            await user.save();
            const forum=await Forum.findById(id);
            forum.upvotes+=1;
            await forum.save();
        }
        return res.status(200).json({status:"success"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const isUpvoted=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(req.user._id);
        if(user.upvotes!==undefined && user.upvotes.includes(id)){
            return res.status(200).json({status:"success",isUpvoted:true});
        }
        else{
            return res.status(200).json({status:"success",isUpvoted:false});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const isDownvoted=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(req.user._id);
        if(user.downvotes!==undefined && user.downvotes.includes(id)){
            return res.status(200).json({status:"success",isDownvoted:true});
        }
        else{
            return res.status(200).json({status:"success",isDownvoted:false});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

const downvote=async(req,res)=>{
    try{
        const {id}=req.body;
        const user=await User.findById(req.user._id);
        if(user.downvotes!==undefined && user.downvotes.includes(id)){
            user.downvotes=user.downvotes.filter((item)=>item!==id);
            await user.save();
            const forum=await Forum.findById(id);
            forum.downvotes-=1;
            await forum.save();
        }
        else{
            if(user.downvotes===undefined){
                user.downvotes=[];
            }
            if(user.upvotes!==undefined && user.upvotes.includes(id)){
                user.upvotes=user.upvotes.filter((item)=>item!==id);
                await user.save();
                const forum=await Forum.findById(id);
                forum.upvotes-=1;
                await forum.save();
            }
            user.downvotes.push(id);
            await user.save();
            const forum=await Forum.findById(id);
            forum.downvotes+=1;
            await forum.save();
        }
        return res.status(200).json({status:"success"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error,status:"error"})
    }
}

module.exports={addToForum,getAllForumPosts,addAttachmentsToForum,getForumData,upvote,downvote,isUpvoted,isDownvoted}