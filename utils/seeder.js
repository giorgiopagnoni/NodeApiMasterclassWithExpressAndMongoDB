const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./../config/db');

dotenv.config({path: `${__dirname}/../.env`});

const Bootcamp = require('./../models/Bootcamp');
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/../_data/bootcamps.json`, 'utf-8'));

const importData = async () => {
    try {
        await connectDB();
        await Bootcamp.create(bootcamps);
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