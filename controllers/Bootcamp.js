const Bootcamp = require('../models/Bootcamp');

module.exports = {
  getBootcamps: async (req, res) => {
    return res.status(200).json({
      success: true,
      msg: 'Show all bootcamps',
    });
  },
  getBootcamp: async (req, res) => {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      msg: `Show bootcamp with ${id}`,
    });
  },
  addBootcamp: async (req, res) => {
    const newBootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'New bootcamp have created',
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
