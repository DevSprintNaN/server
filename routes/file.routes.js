const {uploader,fetchFiles,getFileChanges} = require('../controller/file.controller');
const upload = require('../middleware/multer.middleware');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');


router.post('/upload', authenticated, upload.single('file'), uploader);
router.get('/get-all/:id', authenticated, fetchFiles);
router.get('/get-changes/:file_name', authenticated, getFileChanges);
module.exports = router;