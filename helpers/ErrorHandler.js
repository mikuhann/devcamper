class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  if (err.name === 'CastError') {
    const message = `Provide a valid object id value`;

    error = new ErrorResponse(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;

    error = new ErrorResponse(message, 400)
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
};

module.exports = {
  errorHandler,
  ErrorResponse,
};
