const Project = require('../models/Project.model');
const User = require('../models/User.model');
const Change = require('../models/Change.model');

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
};

const calculateContributions = (changes) => {
    try {
        
        let contributionsArray = [];

        changes.forEach(document => {
            
            let contributionsObj = {
                date:null,
                addedLines: 0,
                removedLines: 0
            };
            
            contributionsObj.date = document.upload_date;

            const addedMatches = document.changes.match(/Added >>>>>(.*?)<<<<</gs);
            const removedMatches = document.changes.match(/Removed >>>>>(.*?)<<<<</gs);

            if (addedMatches) {
                addedMatches.forEach(match => {
                    contributionsObj.addedLines += match.trim().split('\n').length - 2; 
                });
            }

            if (removedMatches) {
                removedMatches.forEach(match => {
                    contributionsObj.removedLines += match.trim().split('\n').length - 2;
                });
            }

            contributionsArray.push(contributionsObj);
        });

        return contributionsArray;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const getContributionsByCurrentUser = async(req, res) =>{
    try{
        const user = req.user._id;
        const changes = await Change.find({user:user});

        if (changes){
            const contributions = calculateContributions(changes);
            return res.status(200).json({status:"success", contributions:contributions});
        }
        else
            return res.status(200).json({status:"success", contributions:null});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:"failed", error:error});
    }
};

module.exports = {
    getContributors,
    getContributorById,
    getContributionsByCurrentUser
};