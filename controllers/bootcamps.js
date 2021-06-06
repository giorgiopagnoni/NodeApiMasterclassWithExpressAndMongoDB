const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = {...req.query};

    // exclude fields
    const removeFields = ['select', 'sort'];
    removeFields.forEach(param => delete reqQuery[param]);

    // create query operators ($gt, $lte...)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr));

    // remove unwanted fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const bootcamps = await query;

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Get one bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
        return;
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
        return;
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
        return;
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get bootcamps within radius
// @route   GET /api/v1/bootcamps/:country/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {country, zipcode, distance} = req.params;

    // get lat/lng from geocoder
    const loc = await geocoder.geocode({
        country, zipcode
    });
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    console.log(loc)

    // calc radius using radians; divide dist by radius of the earth (6378 km)
    const radius = distance / 6378;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {$centerSphere: [[lng, lat], radius]}
        }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});