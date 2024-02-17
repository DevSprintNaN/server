const {createProject,getProjects, getAllProjects} = require('../controller/project.controller');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');

router.post('/create', authenticated, createProject);
router.get('/get', authenticated, getProjects);
router.get('/get-all', authenticated, getAllProjects);
module.exports = router;