// @desc    Logs request to console (UNUSED)
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next();
};

module.exports = logger;