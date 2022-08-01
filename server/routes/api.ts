const express = require('express');
const router = express.Router();

const apiMethods = require('../actions/api/apiMethods');

router.get('/', apiMethods.rootPath);
router.get('/i', apiMethods.otherPage);

export {};
module.exports = router;