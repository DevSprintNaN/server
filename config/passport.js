const User = require("../models/User.model");
require('dotenv').config();
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const initialize=(passport)=>{
  passport.use(new JwtStrategy({
    secretOrKey: process.env._SESSION_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, done) => {
    const user = await User.findById(payload.sub);
    if (user) {
      done(null, user);
    } 
    else {
      done(null, false);
    }
  }));
  
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  
  return passport;
}

module.exports = initialize;