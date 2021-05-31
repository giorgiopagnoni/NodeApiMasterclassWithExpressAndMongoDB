const ErrorResponse = require('./../utils/errorResponse');

const errorHanlder = (err, req, res, next) => {
    console.log(err.stack);

    let error = {...err};
    error.message = err.message;

    // mongoose bad object id
    if (err.name === 'CastError') {
        const message = `Resource with id ${err.value} not found`;
        error = new ErrorResponse(message, 404);
    }

    // mongoose duplicate key
    if (err.code === 11000) {
        const message = `Resource with id ${err.value} already exists`;
        error = new ErrorResponse(message, 400);
    }

    // mongoose validation error
    if (err.name === 'Validation Error') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Something went wrong'
    });
}

module.exports = errorHanlder;