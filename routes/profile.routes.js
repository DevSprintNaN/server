const router = require('express').Router();
const { getSkills, getStarredProjects, getUserSkills,getProfile,updateProfile,matchProjectsBySkills } = require('../controller/profile.controller');
const authenticated = require('../middleware/auth.middleware');


router.get('/get-skills', authenticated, getSkills);
router.get('/get-starred-projects', authenticated, getStarredProjects);
router.get('/get-user-skills', authenticated, getUserSkills);
router.get('/get-profile', authenticated, getProfile);
router.patch('/update-profile', authenticated, updateProfile);
router.get('/find-matches', authenticated, matchProjectsBySkills);

module.exports = router;