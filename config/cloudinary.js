const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({ 
  cloud_name: process.env._CLOUDINARY_CLOUD_NAME, 
  api_key: process.env._CLOUDINARY_API_KEY, 
  api_secret: process.env. _CLOUDINARY_API_SECRET
});

const uploadFile = async (user, file)=>{

  try{

    const currentDate = new Date();
    const options = { timeZone: 'Asia/Dhaka' }; // Set the timezone to GMT+6 (Asia/Dhaka)
    const formattedDate = currentDate.toLocaleString('en-US', options)  
      .replace(/:/g, "-") // Replace colons with hyphens
      .replace(/\//g, "-"); // Replace slashes with hyphens

    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI,{
      resource_type:"auto",
      public_id: `${file.originalname}$_${user._id}$_${formattedDate}`
    });
    return result;
  }catch(error){
    console.log(error);
    return error;
  }
  
};

module.exports = uploadFile;