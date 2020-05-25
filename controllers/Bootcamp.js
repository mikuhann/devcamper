const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');
const geocoder = require('../helpers/Geocoder');
const earthRadius = require('../constants/EarthRadius');
const { roles } = require('../constants/Roles');

module.exports = {
  getBootcamps: async (req, res) => {
    const { queryResults } = res;

    return res.status(200).json(queryResults);
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
  getCoursesByBootcampId: async (req, res) => {
    const { bootcampId } = req.params;

    const courses = await Course.find({ bootcamp: bootcampId });

    if (courses.length === 0) {
      throw new ErrorResponse('No courses found for this bootcamp', 404);
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      payload: courses,
    });
  },
  addCourseToBootcamp: async (req, res) => {
    const { id } = req.params;

    req.body.bootcamp = id;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    let course = await Course.create(req.body);

    course = await course
      .populate({
        path: 'bootcamp',
        select: 'name description',
      })
      .execPopulate();

    return res.status(200).json({
      success: true,
      payload: course,
    });
  },
  getBootcampsWithGeoData: async (req, res) => {
    const { zipcode, distance } = req.params;

    const location = await geocoder.geocode(zipcode);

    const { latitude, longitude } = location[0];

    const radius = distance / earthRadius.miles;

    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
      },
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
    req.body.user = req.user.id;

    const publishedBootcamp = await Bootcamp.findOne({ user: req.user });

    if (publishedBootcamp && req.user.role !== roles.ADMIN) {
      throw new ErrorResponse(
        `User with ID: ${req.user.id} has already published bootcamp`,
        400
      );
    }

    const newBootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
      success: true,
      payload: newBootcamp,
    });
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

    const deletedBootcamp = await Bootcamp.findById(id);

    if (!deletedBootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    await deletedBootcamp.remove();

    return res.status(200).json({
      success: true,
      payload: {},
    });
  },
  uploadBootcampImage: async (req, res) => {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      throw new ErrorResponse(ErrorMessage('bootcamp', id), 404);
    }

    if (!req.files) {
      throw new ErrorResponse('Please upload a file', 400);
    }

    const { file } = req.files;

    if (!file.mimetype.startsWith('image')) {
      throw new ErrorResponse('Please upload an image file', 415);
    }

    if (file.size > process.env.FILE_UPLOAD_MAX_SIZE) {
      throw new ErrorResponse(`Please upload an image less than 1 Mb`, 400);
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);

        throw new ErrorResponse(`Problem with file upload`, 500);
      }

      await Bootcamp.findByIdAndUpdate(id, {
        photo: file.name,
      });

      return res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  },
};
