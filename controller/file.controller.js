const uploadFile = require('../config/cloudinary');
const File = require('../models/File.model');
const Project = require('../models/Project.model');

const createDateTime = ()=>{

    const createdAtGMT6 = new Date();
    createdAtGMT6.setHours(createdAtGMT6.getHours() + 6);

    return createdAtGMT6;
};

const uploader = async(req, res) => {
    try{
        const user = req.user;

        const date = createDateTime();

        const result = await uploadFile(date, user, req.file)
        console.log(result);

        const url = result.url; 
        const resource_type = result.resource_type;

        let existingFile = await File.findOne({name:req.file.originalname});

        if(existingFile){
            existingFile.users.push(user._id);
            existingFile.files.push(url);
            existingFile.fileType.push(resource_type);
            existingFile.upload_date.push(date);
        }else{
            existingFile = new File({
                name:req.file.originalname,
                users:[user._id],
                files:[url],
                upload_date:[date],
                fileType:[resource_type],
                projectID:req.body.projectID
            });

           
        }
        await existingFile.save();
        const project=await Project.findById(req.body.projectID);
        project.fileId.push(existingFile._id);
        if(project.users.indexOf(user.username)===-1){
            project.users.push(user.username);
            project.userIds.push(user._id);
        }
        await project.save();
        res.status(200).json({status:"success", message:"File created successfully"});

    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
};

module.exports = uploader;