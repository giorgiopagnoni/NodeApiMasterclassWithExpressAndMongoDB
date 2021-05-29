const express = require('express');
const {
    getBootcamps
} = require('../controllers/bootcamps');

const router = express.Router();
router.route('/').get(getBootcamps)

module.exports = router;