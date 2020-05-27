const BootcampRoutes = require('./bootcamps');
const CourseRoutes = require('./courses');
const AuthRoutes = require('./auth');
const { errorHandler } = require('../helpers/ErrorHandler');
const swaggerUI = require('swagger-ui-express');

const swaggerConfig = require('../swagger');

module.exports = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
  app.use('/api/v1/bootcamps', BootcampRoutes);
  app.use('/api/v1/courses', CourseRoutes);
  app.use('/api/v1/auth', AuthRoutes);
  app.use(errorHandler);
};
