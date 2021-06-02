const express = require('express');
const {
    getBootcamps,
    createBootcamp,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps');

const router = express.Router();
router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)
router.route('/:id')
    .get(getBootcamp)
    .put((req, res, next) => {
        // we don't want the clients to update the location directly
        delete req.body.location;
        next();
    },updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router;