const passport=require('../config/passport')(require('passport'));

const unverified = async(req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user || user.verified===true) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

  module.exports = unverified;