const Bootcamp = require('../models/Bootcamp');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');
const geocoder = require('../helpers/Geocoder');
const earthRadius = require('../constants/EarthRadius');

module.exports = {
  getBootcamps: async (req, res) => {
    let selectFields, sortFields;
    const { sort, select, ...filter } = req.query;

    if (select) {
      selectFields = select.split(',').join(' ');
    }

    if (sort) {
      sortFields = sort.split(',').join(' ');
    }

    let queryStr = JSON.stringify(filter);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    const bootcamps = await Bootcamp.find(JSON.parse(queryStr)).select(selectFields).sort(sortFields || 'name');

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
  getBootcampsWithGeoData: async (req, res) => {
    const { zipcode, distance } = req.params;

    const location = await geocoder.geocode(zipcode);

    const { latitude, longitude } = location[0];

    const radius = distance/earthRadius.miles;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });

    if (bootcamps.length === 0) {
      throw new ErrorResponse('No bootcamp in this area', 404);
    }

    return res.status(200).json({
      success: true,
      count: bootcamps.length,
      payload: bootcamps,
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
