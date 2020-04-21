const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

const Bootcamps = require('../models/Bootcamp');
const Courses = require('../models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (e) {
    console.log(e);
  }
};

connectDB();

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/seeddata/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/seeddata/courses.json`, 'utf-8')
);

const seedData = async () => {
  try {
    await Bootcamps.create(bootcamps);

    // await Courses.create(courses);

    console.log('Data seeded...'.green);

    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

const deleteSeedData = async () => {
  try {
    await Bootcamps.deleteMany();

    await Courses.deleteMany();

    console.log('Seed data removed'.red);

    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

if (process.argv[2] === '-i') {
  seedData();
} else if (process.argv[2] === '-d') {
  deleteSeedData();
}
