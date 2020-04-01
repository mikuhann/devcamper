const { errorHandler } = require('../helpers/ErrorHandler');

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(
      () => {
        errorHandler({ success: false, statusCode: 500, message: 'Server Error' }, res)
      }
    );
};

module.exports = {
  asyncMiddleware,
};
