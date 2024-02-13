const {createProject,getProjects} = require('../controller/project.controller');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');

router.post('/create', authenticated, createProject);
router.get('/get-all', authenticated, getProjects);
module.exports = router;