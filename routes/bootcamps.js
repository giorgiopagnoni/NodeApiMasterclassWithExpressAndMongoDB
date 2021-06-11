const express = require('express');
const {
    getBootcamps,
    createBootcamp,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
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
    }, updateBootcamp)
    .delete(deleteBootcamp)

router.route('/:id/photo').put(bootcampPhotoUpload);
router.route('/radius/:country/:zipcode/:distance').get(getBootcampsInRadius);

const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

module.exports = router;