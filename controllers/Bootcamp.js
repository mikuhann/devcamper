const Bootcamp = require('../models/Bootcamp');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');

module.exports = {
  getBootcamps: async (req, res) => {
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    const bootcamps = await Bootcamp.find(JSON.parse(queryStr));

    if (bootcamps.length === 0) {
      throw new ErrorResponse('There is no bootcamps with given params', 404);
    }

    return res.status(200).json({
      success: true,
      payload: bootcamps,
    });
  },
  getBootcamp: async (req, res) => {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: bootcamp,
    });
  },
  addBootcamp: async (req, res) => {
    const newBootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
      success: true,
      payload: newBootcamp,
    })
  },
  updateBootcamp: async (req, res) => {
    const { id } = req.params;

    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: updatedBootcamp,
  });
  },
  deleteBootcamp: async (req, res) => {
    const { id } = req.params;

    const deletedBootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!deletedBootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: {},
    });
  }
};
