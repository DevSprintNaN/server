const router = require('express').Router()
const {
    register,
    login,
    validateUser,
    getUser,
    verifyEmail,
    verifyOtp,
    otpForgotPassword,
    resetPassword
} = require('../controller/auth.controller');
const unverified = require('../middleware/unverified.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', validateUser);
router.get('/get-user', getUser);
router.post('/verify-email',unverified, verifyEmail);
router.post('/verify-otp',unverified, verifyOtp);
router.post('/forgot-password', otpForgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
