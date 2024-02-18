const jwt = require('jsonwebtoken');

async function generateJwt(user) {
  const payload = {
    sub: user._id,
    type:user.type,
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  };

  const token = await jwt.sign(payload, process.env._SESSION_SECRET,{algorithm: 'HS256'});
  return token;
}

module.exports = generateJwt;