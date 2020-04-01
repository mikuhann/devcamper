const errorHandler = (err, res) => {
  const { success, message, statusCode } = err;

  res.status(statusCode).json({
    success: success,
    message: message,
  });
};

module.exports = {
  errorHandler,
};
