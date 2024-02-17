const router = require('express').Router()
const {
    register,
    login,
    logout,
    validateUser,
    getUser
} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify', validateUser);
router.post('/get-user',getUser);

module.exports = router;
