const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config({ path: './config/config.env' });

const routes = require('./routes');
const connectDB = require('./helpers/ConnectMongo');

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

routes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `App is running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  );
});
