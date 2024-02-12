const uploadFile = require('../config/cloudinary');

const uploader = async(req, res) => {
    try{
        const user = req.user;

        const result = await uploadFile(user, req.file)
        console.log(result);
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
};

module.exports = uploader;