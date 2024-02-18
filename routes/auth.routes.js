const router = require('express').Router()
const {
    register,
    login,
    validateUser,
    getUser
} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', validateUser);
router.get('/get-user', getUser);

module.exports = router;
