const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({ 
  cloud_name: process.env._CLOUDINARY_CLOUD_NAME, 
  api_key: process.env._CLOUDINARY_API_KEY, 
  api_secret: process.env. _CLOUDINARY_API_SECRET
});

const uploadFile = async (date, user, file)=>{

  try{

    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI,{
      resource_type:"auto",
      public_id: `${user._id}$_${date.toISOString()}$_${file.originalname}`
    });
    return result;
  }catch(error){
    console.log(error);
    return error;
  }
  
};
const deleteFile = async(file) => {
  try{
    await cloudinary.v2.uploader.destroy(file);
  }catch(error){
    console.log(error);
    throw error;
  }
}
module.exports = {uploadFile, deleteFile};