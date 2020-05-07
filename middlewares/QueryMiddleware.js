const { ErrorResponse } = require('../helpers/ErrorHandler');

const QueryMiddleware = (model, populate) => async (req, res, next) => {
  let selectFields, sortFields, result, query;
  const { sort, select, page, limit, ...filter } = req.query;

  if (select) {
    selectFields = select.split(',').join(' ');
  }

  if (sort) {
    sortFields = sort.split(',').join(' ');
  }

  const currentPage = parseInt(page, 10) || 1;
  const currentLimit = parseInt(limit, 10) || 25;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const total = await model.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: currentPage + 1,
      limit: currentLimit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: currentPage - 1,
      limit: currentLimit,
    };
  }

  let queryStr = JSON.stringify(filter);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model
    .find(JSON.parse(queryStr))
    .select(selectFields)
    .sort(sortFields || 'name')
    .skip(startIndex)
    .limit(currentLimit);

  if (populate) {
    query.populate(populate);
  }

  result = await query;

  if (result.length === 0) {
    next(new ErrorResponse('There is no results with given params', 404));
  }

  res.queryResults = {
    success: true,
    count: result.length,
    pagination,
    payload: result,
  };

  next();
};

module.exports = QueryMiddleware;
