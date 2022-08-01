const express = require('express');
const router = express.Router();

const helloApi = require('../actions/api/helloApi');
const doctorActions = require('../actions/api/doctors');

router.get('/', helloApi.rootPath);
router.get('/saveDoctor', doctorActions.saveDoctor);

export {};
module.exports = router;