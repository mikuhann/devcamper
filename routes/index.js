const BootcampRoutes = require('./bootcamps');
const CourseRoutes = require('./courses');
const { errorHandler } = require('../helpers/ErrorHandler');
const swaggerUI = require('swagger-ui-express');

const swaggerConfig = require('../swagger');

module.exports = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
  app.use('/api/v1/bootcamps', BootcampRoutes);
  app.use('/api/v1/courses', CourseRoutes);
  app.use(errorHandler);
};
