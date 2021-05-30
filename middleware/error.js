const errorHanlder = (err, req, res, next) => {
    console.log(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Something went wrong'
    });
}

module.exports = errorHanlder;