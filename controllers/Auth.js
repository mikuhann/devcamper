const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');

module.exports = {
  register: async (req, res) => {
    res.status(200).json({
      success: true,
    });
  },
};
