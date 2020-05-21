const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = user.getSignedJWT();

    return res.status(200).json({
      success: true,
      token,
    });
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

    const token = user.getSignedJWT();

    return res.status(200).json({
      success: true,
      token,
    });
  },
};
