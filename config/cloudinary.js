const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({ 
  cloud_name: process.env._CLOUDINARY_CLOUD_NAME, 
  api_key: process.env._CLOUDINARY_API_KEY, 
  api_secret: process.env. _CLOUDINARY_API_SECRET
});

const uploadFile = async (file)=>{
  await cloudinary.uploader.upload(`https://upload.wikimedia.org/wikipedia/commons/a/ae/${file}`,
  function(error, result) {console.log(result); });
};

module.exports = uploadFile;