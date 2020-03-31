const BootcampRoutes = require('./bootcamps');

module.exports = (app) => {
  app.use('/api/v1/bootcamps', BootcampRoutes);
};