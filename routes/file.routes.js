const uploader = require('../controller/file.controller');
const upload = require('../middleware/multer.middleware');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');


router.post('/upload', authenticated, upload.single('file'), uploader);

module.exports = router;