const router=require('express').Router();
const authenticated=require('../middleware/auth.middleware');
const {addToForum,getAllForumPosts, addAttachmentsToForum, getForumData, upvote, downvote, isUpvoted, isDownvoted}=require('../controller/forum.controller');
const upload = require('../middleware/multer.middleware');

router.get('/get',authenticated,getAllForumPosts);
router.post('/add',authenticated,upload.single('coverImage'),addToForum);
router.patch('/add',authenticated,upload.single('file'),addAttachmentsToForum);
router.get('/get/:id',authenticated,getForumData);
router.post('/upvote',authenticated,upvote);
router.post('/downvote',authenticated,downvote);
router.get('/is-upvoted/:id',authenticated,isUpvoted);
router.get('/is-downvoted/:id',authenticated,isDownvoted);

module.exports=router;