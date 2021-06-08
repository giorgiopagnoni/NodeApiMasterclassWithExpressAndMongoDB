const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./../config/db');

dotenv.config({path: `${__dirname}/../.env`});

const Bootcamp = require('./../models/Bootcamp');
const Course = require('./../models/Course');
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/../_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../_data/courses.json`, 'utf-8'));

const importData = async () => {
    try {
        await connectDB();
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('data imported');
        process.exit();
    } catch (e) {
        console.log(e);
    }
}

const deleteData = async () => {
    try {
        await connectDB();
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('data deleted');
        process.exit();
    } catch (e) {
        console.log(e);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}