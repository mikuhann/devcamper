const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');
const filterFalseValues = require('../helpers/FilterFalseValues');

module.exports = {
  updateProfile: async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.user;

    const fieldsToUpdate = {
      name,
      email,
    };

    const user = await User.findByIdAndUpdate(
      id,
      filterFalseValues(fieldsToUpdate),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      throw new ErrorResponse(ErrorMessage('user', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: user,
    });
  },
  getAllUsers: async (req, res) => {
    res.status(200).json(res.queryResults);
  },
  getUser: async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ErrorResponse(ErrorMessage('user', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: user,
    });
  },
  createUser: async (req, res) => {
    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      payload: user,
    });
  },
  updateUser: async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, filterFalseValues(req.body), {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ErrorResponse(ErrorMessage('user', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: user,
    });
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new ErrorResponse(ErrorMessage('user', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: {},
    });
  },
};
