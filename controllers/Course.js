const Course = require('../models/Course');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');

module.exports = {
  getCourses: async (req, res) => {
    const courses = await Course.find();

    if (courses.length === 0) {
      throw new ErrorResponse('No courses found', 404);
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      payload: courses,
    });
  },
};