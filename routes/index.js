const BootcampRoutes = require('./bootcamps');
const { errorHandler } = require('../helpers/ErrorHandler');

module.exports = (app) => {
  app.use('/api/v1/bootcamps', BootcampRoutes);
  app.use(errorHandler);
};
