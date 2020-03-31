const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const routes = require('./routes');

dotenv.config({ path: './config/config.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

routes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
