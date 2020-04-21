const Course = require('../models/Course');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');

module.exports = {
  getCourses: async (req, res) => {
    const courses = await Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (courses.length === 0) {
      throw new ErrorResponse('No courses found', 404);
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      payload: courses,
    });
  },
  getCourse: async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!course) {
      throw new ErrorResponse(ErrorMessage('course', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: course,
    });
  },
};
