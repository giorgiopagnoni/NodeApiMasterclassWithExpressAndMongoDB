const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const bootcamps = require('./routes/bootcamps');
app.use('/api/v1/bootcamps', bootcamps);

app.listen(PORT);