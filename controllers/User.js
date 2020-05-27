const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');
const ErrorMessage = require('../helpers/ErrorMessage');
const filterFalseValues = require('../helpers/FilterFalseValues');

module.exports = {
  updateProfile: async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.user;

    const fieldsToUpdate = {
      name,
      email,
    };

    const user = await User.findByIdAndUpdate(
      id,
      filterFalseValues(fieldsToUpdate),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      throw new ErrorResponse(ErrorMessage('user', id), 404);
    }

    return res.status(200).json({
      success: true,
      payload: user,
    });
  },
};
