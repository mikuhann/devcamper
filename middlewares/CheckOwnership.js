const { ErrorResponse } = require('../helpers/ErrorHandler');
const { roles } = require('../constants/Roles');

const CheckOwnership = (model) => async (req, res, next) => {
  const { id } = req.params;

  const checkItem = await model.findById(id);

  if (
    checkItem.user.toString() !== req.user.id &&
    req.user.role !== roles.ADMIN
  ) {
    next(
      new ErrorResponse(
        `User with ID: ${req.user.id} isn't authorize to do this`,
        401
      )
    );
  }

  next();
};

module.exports = CheckOwnership;
