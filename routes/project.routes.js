const {createProject,getProjects, getAllProjects, starProject, unstarProject, getProject, isProjectStarred, numberOfContributorsPerProject, numberOfStarsPerProject} = require('../controller/project.controller');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');

router.post('/create', authenticated, createProject);
router.get('/get', authenticated, getProjects);
router.get('/get-all', authenticated, getAllProjects);
router.post('/star', authenticated, starProject);
router.post('/unstar', authenticated, unstarProject);
router.get('/get-project/:id', authenticated, getProject);
router.get('/is-starred/:id', authenticated, isProjectStarred);
router.get('/number-of-contributors', authenticated, numberOfContributorsPerProject);
router.get('/number-of-stars', authenticated, numberOfStarsPerProject);
module.exports = router;