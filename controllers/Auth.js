const User = require('../models/User');
const { ErrorResponse } = require('../helpers/ErrorHandler');

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(200).json({
      success: true,
    });
  },
};
