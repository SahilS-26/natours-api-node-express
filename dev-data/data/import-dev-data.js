const fs = require('fs');
const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModal');

// Configure DNS to use Google's DNS servers (for connection MongoDB)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

// Read JSON FILE
const tours = JSON.parse(
  // fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
);
const users = JSON.parse(
  // fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
  // fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Sucessfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Sucessfully Deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
