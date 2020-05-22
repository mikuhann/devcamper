const CourseRouter = require('express').Router();
const CourseController = require('../controllers/Course');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const Course = require('../models/Course');
const QueryMiddleware = require('../middlewares/QueryMiddleware');
const { protectRoute } = require('../middlewares/Auth');

CourseRouter.route('/').get(
  QueryMiddleware(Course, { path: 'bootcamp', select: 'name description' }),
  asyncMiddleware(CourseController.getCourses)
);
CourseRouter.route('/:id')
  .get(asyncMiddleware(CourseController.getCourse))
  .put(protectRoute, asyncMiddleware(CourseController.updateCourse))
  .delete(protectRoute, asyncMiddleware(CourseController.deleteCourse));

module.exports = CourseRouter;
