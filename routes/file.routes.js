const {
    uploader,
    fetchFiles,
    getFileChanges,
    restorePreviousVersion,
} = require('../controller/file.controller');
const upload = require('../middleware/multer.middleware');
const router = require('express').Router();
const authenticated = require('../middleware/auth.middleware');

const {getContributorById} = require('../controller/contribution.controller');

router.post('/upload', authenticated, upload.single('file'), uploader);
router.get('/get-all/:id', authenticated, fetchFiles);
router.get('/get-changes/:file_name', authenticated, getFileChanges);
router.put('/restore', authenticated, restorePreviousVersion);

router.get('/get-contributor/:id', authenticated, getContributorById)
module.exports = router;