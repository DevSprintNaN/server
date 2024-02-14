const uploadFile = require('../config/cloudinary');
const File = require('../models/File.model');
const axios = require('axios');
const diff = require('diff');
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

        let existingFile = await File.findOne({name:req.file.originalname});

        const result = await uploadFile(date, user, req.file)
        console.log(result);

        const url = result.url; 
        const resource_type = result.resource_type;


        if(existingFile){
            const existingFileContent = await axios.get(existingFile.files[existingFile.files.length - 1]);
            const uploadedFileContent = await axios.get(url);

            const differences = diff.diffLines(existingFileContent.data, uploadedFileContent.data);

            if (differences.length === 1 && differences[0].added === undefined && differences[0].removed === undefined) {
                return res.status(500).json({ status: "failed", message: "Same file uploaded" });
            }
                
            existingFile.users.push(user._id);
            existingFile.files.push(url);
            existingFile.fileType.push(resource_type);
            existingFile.upload_date.push(date);

            await pushFileChanges(existingFile);

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
        return res.status(200).json({status:"success", message:"File created successfully"});
        
    }catch(error){
        console.log(error);
        return res.status(500).json({error:error});
    }
};

const pushFileChanges = async(existingFile) => {
    try{
        const url = existingFile.files;
        const url1 = url[url.length - 2]; 
        const url2 = url[url.length - 1];

        const response1 = await fetchFileContent(url1);
        const response2 = await fetchFileContent(url2);

        compareFiles(response1, response2);

    }catch(error){
        console.log(error);
    }
};
function compareFiles(file1Content, file2Content) {
    const differences = diff.diffLines(file1Content, file2Content);

    differences.forEach(part => {
        if (part.added) {
            console.log('Added:', part.value);
            console.log(typeof(part));
        }
        if (part.removed) {
            console.log('Removed:', part.value);
            console.log(typeof(part));
        }
    });

    return differences;
}

async function fetchFileContent(cloudinaryUrl) {
    try {
        const response = await axios.get(cloudinaryUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error;
    }
}


module.exports = uploader;