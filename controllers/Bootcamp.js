const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');

module.exports = {
  getBootcamps: async (req, res) => {
    const bootcamps = await Bootcamp.find();

    return res.status(200).json({
      success: true,
      payload: bootcamps,
    });
  },
  getBootcamp: async (req, res) => {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp || bootcamp.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        msg: `No bootcamp with that ID: ${id}`,
      })
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

    return res.status(200).json({
      success: true,
      msg: `Update bootcamp with ${id}`,
    });
  },
  deleteBootcamp: async (req, res) => {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      msg: `Delete bootcamp with ${id}`,
    });
  }
};
