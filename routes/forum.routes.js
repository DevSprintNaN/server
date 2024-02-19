const router=require('express').Router();
const authenticated=require('../middleware/auth.middleware');
const {addToForum,getAllForumPosts, addAttachmentsToForum, getForumData}=require('../controller/forum.controller');
const upload = require('../middleware/multer.middleware');

router.get('/get',authenticated,getAllForumPosts);
router.post('/add',authenticated,upload.single('coverImage'),addToForum);
router.patch('/add',authenticated,upload.single('file'),addAttachmentsToForum);
router.get('/get/:id',authenticated,getForumData);
module.exports=router;