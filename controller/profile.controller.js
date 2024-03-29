const Project = require('../models/Project.model');
const Skill = require('../models/Skill.model');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const userToFind = await User.findById(user._id).select("-password");
        res.status(200).json({ status: "success", user: userToFind });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};


const addSkills = async (newSkills) => {
    try {
        const existingSkills = await Skill.find({ skill: { $in: newSkills } });
        if (existingSkills.length > 0) {
            throw Error("Some or All of the skills already exist");
        }
        await Skill.insertMany(newSkills.map(skill => ({ skill })));
        return { status: "success", message: "Skills added successfully" };
    }
    catch (error) {
        throw Error(error)
    }
};

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({});
        const user = User.findById(req.user._id);
        const userSkills = user.skills;
        if (!userSkills) {
            return res.status(200).json({ status: "success", skills: skills.map(skill => skill.skill) });
        }
        else {
            return res.status(200).json({ status: "success", skills: skills.filter(skill => !userSkills.includes(skill.skill)) });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

const getUserSkills = async (req, res) => {
    try {
        const user = req.user;
        const userToFind = await User.findById(user._id);
        const skills = userToFind.skills;
        res.status(200).json({ status: "success", skills });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

const matchProjectsBySkills = async (req, res) => {
    try {
        const user = req.user;
        const userToFind = await User.findById(user._id);
        const skills = userToFind.skills;

        const projects = await Project.find();

        let matchedProjects = [];

        projects.forEach((project) => {
            let isProject = false;
            if (!isProject) {
                project.contents.forEach((content) => {
                    if (!isProject) {
                        skills.forEach((skill) => {
                            if(!isProject){
                                if (stringsMatch(content, skill)) {
                                    matchedProjects.push(project);
                                    isProject = true;
                                }
                            }
                            
                        });

                    }
                })
            }
        });

        return res.status(200).json({ status: "success", projects: matchedProjects });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ status: "failed", error: error });
    }
};

function jaccardSimilarity(word1, word2) {
    const set1 = new Set(word1.split(""));
    const set2 = new Set(word2.split(""));

    const intersection = new Set([...set1].filter(char => set2.has(char)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
}

function stringsMatch(str1, str2) {
    const words1 = str1.split(" ");
    const words2 = str2.split(" ");

    for (const word1 of words1) {
        for (const word2 of words2) {
            const similarity = jaccardSimilarity(word1, word2);
            if (similarity >= 0.7) {
                return true;
            }
        }
    }

    return false;
}

const addUserSkills = async (skills, newSkills, user) => {
    try {
        const userToFind = await User.findById(user._id);
        console.log(skills, newSkills);
        userToFind.skills = [];
        if (skills.length > 0 && userToFind.skills.includes(skills)) {
            throw Error("Some or All of the skills already exist");
        }
        else if (newSkills.length > 0 && userToFind.skills.includes(newSkills)) {
            throw Error("Some or All of the new skills already exist");
        }
        userToFind.skills.push(...skills);
        userToFind.skills.push(...newSkills);
        await userToFind.save();
        return { status: "success", message: "Skills added successfully" };
    }
    catch (error) {
        console.log(error);
        throw Error(error);
    }
}

const getStarredProjects = async (req, res) => {
    try {
        const user = req.user;
        const userToFind = await User.findById(user._id);
        const projectIDs = userToFind.starred_projects;
        const projects = await Project.find({ _id: { $in: projectIDs } });
        res.status(200).json({ status: "success", projects });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { email, username, skills, newSkills, currentPassword, newPassword, confirmNewPassword } = req.body;
        if (email !== req.user.email || username !== req.user.username) {
            return res.status(400).json({ status: "error", passwordError: false, message: "Email and username cannot be changed" });
        }
        if (newSkills.length > 0) {
            await addSkills(newSkills);
        }
        await addUserSkills(skills, newSkills, req.user);
        if (currentPassword === "") {
            if (newPassword !== "" || confirmNewPassword !== "") {
                return res.status(400).json({ status: "error", passwordError: true, message: "Current password is required" });
            }
            else {
                return res.status(200).json({ status: "success", message: "Profile updated successfully" });
            }
        }
        console.log(currentPassword);
        const user = req.user;
        const userToFind = await User.findById(user._id);
        console.log(userToFind);
        if (!userToFind) {
            return res.status(400).json({ status: "error", passwordError: false, message: "User not found" });
        }
        const isMatch = await User.comparePassword(user, currentPassword);
        if (!isMatch) {
            return res.status(400).json({ status: "error", passwordError: true, message: "Current password is incorrect" });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ status: "error", passwordError: true, message: "Passwords do not match" });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        userToFind.password = hash;
        await userToFind.save();
        return res.status(200).json({ status: "success", message: "Password updated successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error, passwordError: false });
    }
}



module.exports = { getSkills, getStarredProjects, updateProfile, getUserSkills, getProfile, matchProjectsBySkills };