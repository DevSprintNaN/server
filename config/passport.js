const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require("../models/User.model");
require('dotenv').config();


function initialize(passport) {
  const authenticateUser = async (email, password, done) => {

       User.findOne({ email: email })
       .then((user) => {
         if (!user) {
            console.log("User not found");
           return done(null, false, {
             message: "User not found",
           });
         } else {
           bcrypt.compare(password, user.password, (err, isMatch) => {
             if (err) throw err;
             if (isMatch) {
               return done(null, user);
             } else {
                console.log('incorrect password');
               return done(null, false, { message: "Incorrect Password" });
             }
           });
         }
       })
       .catch((err) => {
         console.log(err);
       });
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) 

  passport.serializeUser((user, done) =>{
    done(null, user.id)
  }) 
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize;