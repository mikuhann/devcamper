const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const sendTokenResponse = require('../helpers/TokenResponse');
const sendEmail = require('../utils/SendEmail');
const crypto = require('crypto');

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
  forgotPassword: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new ErrorResponse('No user with that email', 404);
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because of you 
    (or someone else) has requested to reset a password. Please make a PUT 
    request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      return res.status(200).json({
        success: true,
        payload: 'Email sent',
      });
    } catch (e) {
      console.log(e);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      throw new ErrorResponse('Email could not be sent', 500);
    }
  },
  resetPassword: async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorResponse('Invalid token', 400);
    }

    if (!password) {
      throw new ErrorResponse('Input new password', 403);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  },
};
