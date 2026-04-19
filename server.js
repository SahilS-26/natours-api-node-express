const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

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
  });
// .catch((err) => {
//   console.error('DB connection failed:', err.message);
//   process.exit(1);
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
