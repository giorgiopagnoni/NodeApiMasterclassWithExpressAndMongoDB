const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// load env vars
dotenv.config();
const PORT = process.env.PORT;

// connect to DB
connectDB();

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const bootcamps = require('./routes/bootcamps');
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(PORT);
server.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});