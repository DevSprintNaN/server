const upload = require('../controller/file.controller');

const router = require('express').Router();

router.post('/upload',upload);

module.exports = router;