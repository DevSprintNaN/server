const uploadFile = require('../config/cloudinary');

const upload = async(req, res) => {
    try{
        const user = req.user;

        console.log(req.file.path);
        res.status(200);
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
};

module.exports = upload;