const jwt = require('jsonwebtoken');
const {base64encode} = require('nodejs-base64');
const CryptoJS = require('crypto-js');

async function generateJwt(user,headers) {
  try{
    const payload = {
      sub: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
  
    const token = await jwt.sign(CryptoJS.AES.encrypt(JSON.stringify(payload),process.env._TOKEN_SECRET)+"."+CryptoJS.AES.encrypt(JSON.stringify(headers),process.env._TOKEN_SECRET), process.env._SESSION_SECRET,{algorithm: 'HS256'});
    return token;
  }
  catch(error){
    console.log(error);
    return null;
  }
}

module.exports = generateJwt;