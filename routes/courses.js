const CourseRouter = require('express').Router();
const CourseController = require('../controllers/Course');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');

CourseRouter.route('/').get(asyncMiddleware(CourseController.getCourses));
CourseRouter.route('/:id').get(asyncMiddleware(CourseController.getCourse));

module.exports = CourseRouter;
