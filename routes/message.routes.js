const { addMessage, getMessages } = require('../controller/messages.controller');
const authenticated = require('../middleware/auth.middleware');
const { isServiceAuthenticated } = require('../middleware/service.middleware');
const router = require('express').Router();

router.post('/add',isServiceAuthenticated, addMessage);
router.get('/get-all/:id',authenticated, getMessages);
module.exports = router;