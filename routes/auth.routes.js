const router = require('express').Router()
const {
    register,
    login,
    logout,
    validateUser
} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify', validateUser);

module.exports = router;
