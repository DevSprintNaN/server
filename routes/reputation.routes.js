
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');

const {getContributionsByCurrentUser} = require('../controller/contribution.controller');

router.get('/get-contributions', authenticated, getContributionsByCurrentUser);

module.exports = router;