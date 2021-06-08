const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// load env vars
dotenv.config();
const PORT = process.env.PORT;

// connect to DB
connectDB();

const app = express();

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// body parser
app.use(express.json());

// routes
const bootcamps = require('./routes/bootcamps');
app.use('/api/v1/bootcamps', bootcamps);
const courses = require('./routes/courses');
app.use('/api/v1/courses', courses);

// error middleware
app.use(errorHandler);

const server = app.listen(PORT);
server.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});