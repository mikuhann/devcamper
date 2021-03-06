const CourseRouter = require('express').Router();
const CourseController = require('../controllers/Course');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const Course = require('../models/Course');
const QueryMiddleware = require('../middlewares/QueryMiddleware');
const { protectRoute, checkRole } = require('../middlewares/Auth');
const { roles } = require('../constants/Roles');
const CheckOwnership = require('../middlewares/CheckOwnership');

CourseRouter.route('/').get(
  QueryMiddleware(Course, { path: 'bootcamp', select: 'name description' }),
  asyncMiddleware(CourseController.getCourses)
);
CourseRouter.route('/:id')
  .get(asyncMiddleware(CourseController.getCourse))
  .put(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Course),
    asyncMiddleware(CourseController.updateCourse)
  )
  .delete(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Course),
    asyncMiddleware(CourseController.deleteCourse)
  );

module.exports = CourseRouter;
