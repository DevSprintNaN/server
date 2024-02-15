const uploadFile = require('../config/cloudinary');
const File = require('../models/File.model');
const axios = require('axios');
const diff = require('diff');
const Project = require('../models/Project.model');
const Change = require('../models/Change.model');
const createDateTime = ()=>{

    const createdAtGMT6 = new Date();
    createdAtGMT6.setHours(createdAtGMT6.getHours() + 6);

    return createdAtGMT6;
};

const uploader = async(req, res) => {
    try{
        const user = req.user;
        const {currentDirectory,projectID}=req.body;

        const date = createDateTime();

        let existingFile = await File.findOne({name:projectID+currentDirectory+req.file.originalname});
        //console.log(existingFile);
        const result = await uploadFile(date, user, req.file)
        //console.log(result) ;

        const url = result.url; 
        const resource_type = result.format;


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

            await pushFileChanges(existingFile, user);

        }else{
            existingFile = new File({
                name:projectID+currentDirectory+req.file.originalname,
                users:[user._id],
                files:[url],
                upload_date:[date],
                fileType:[resource_type],
                projectID:projectID
            });
           
        }
        await existingFile.save();
        const project=await Project.findById(projectID);
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

const pushFileChanges = async(existingFile, user) => {
    try{
        const url = existingFile.files;
        const url1 = url[url.length - 2]; 
        const url2 = url[url.length - 1];

        const response1 = await fetchFileContent(url1);
        const response2 = await fetchFileContent(url2);

        const data = compareFiles(existingFile, response1, response2, user);

        const change = new Change(data);
        await change.save();

    }catch(error){
        console.log(error);
        throw error;
    }
};
function compareFiles(existingFile, file1Content, file2Content, user) {
    const differences = diff.diffLines(file1Content, file2Content);

    let data = {
        file_name: existingFile.name,
        upload_date: existingFile.upload_date[ existingFile.upload_date.length - 1],
        changes:"",
        user:user._id
    }

    differences.forEach(part => {
        if (part.added) {
            data["changes"] += "Added >>>>>\n" + part.value + "\n<<<<<\n";
        }
        if (part.removed) {
            data["changes"] += "Removed >>>>>\n" + part.value + "\n<<<<<\n"
        }
    });

    return data;
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

const fetchFiles=async(req,res)=>{
    try{
        const {id}=req.params;
        const files=await File.find({projectID:id});
        return res.status(200).json({status:"success",files:files});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:error});
    }
};

const constructChanges = (fileChanges) => {
    try{
        let changesArray = [];

        let match;
        fileChanges.forEach(change => {

            let arrayObj = {
                date: change.upload_date,
                changes:[],
                user:change.user
            }

            const regex = /(?<=^|\n)(Added|Removed) >>>>>\n((?:.|\n)*?)\n<<<<<\n/g; 
            while ((match = regex.exec(change.changes)) !== null) {
                const changeObj = {
                    heading:match[1],
                    content:match[2]
                };

                arrayObj.changes.push(changeObj);
              }

              changesArray.push(arrayObj);
        });

        return changesArray;
    }catch(error){
        console.log(error);
        throw error;
    }
}

const getFileChanges = async(req, res) =>{
    try{

        const file_name = decodeURIComponent(req.params.file_name);
        const fileChanges = await Change.find({file_name:file_name});

        const changesArray = constructChanges(fileChanges);

        return res.status(200).json({status:"success", message:"Changes fetched", changes:changesArray})

    }catch(error){
        console.log(error);
        return res.status(500).json({status:"failed", error:error});
    }
};

const restorePreviousVersion = async(req, res) =>{
    try{
        const name = decodeURIComponent(req.body.file_name);
        const previousFile = await File.findOne({name:name});
        const user = req.user;
        
        if(!previousFile){
            
            return res.status(404).json({status:"failed", message:"File not found"});

        }
        else if(!previousFile.files.length>=2){
            return res.status(404).json({status:"failed", message:"Previous version not available"});
        }   

        const date = createDateTime();

        previousFile.users.push(user._id);
        previousFile.files.push(previousFile.files[previousFile.files.length-2]);
        previousFile.upload_date.push(date);
        previousFile.fileType.push(previousFile.fileType[previousFile.fileType.length -2]);

        await previousFile.save();

        await pushFileChanges(previousFile);

        return res.status(200).json({status:"success", message:"File restored to previous version"});
        
    }catch(error){
        console.log(error);
        return res.status(500).json({status:"failed", error:error});
    }
}

module.exports = {
    uploader,
    fetchFiles, 
    getFileChanges,
    restorePreviousVersion,
    constructChanges
};