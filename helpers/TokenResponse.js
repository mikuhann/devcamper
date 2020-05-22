const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWT();

  const options = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE)),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = sendTokenResponse;
