const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const sendTokenResponse = require('../helpers/TokenResponse');

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorResponse('Please provide an email and password', 403);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    sendTokenResponse(user, 200, res);
  },
  getCurrentUser: async (req, res) => {
    const userId = req.user;

    const user = await User.findById(userId);

    return res.status(200).json({
      success: true,
      payload: user,
    });
  },
};
