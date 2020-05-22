const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    next(new ErrorResponse('Not authorize to access this route', 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken.id);

    next();
  } catch (e) {
    next(new ErrorResponse('Not authorize to access this route', 401));
  }
};

module.exports = {
  protectRoute,
};
