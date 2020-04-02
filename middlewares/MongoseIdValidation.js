const mongoose = require('mongoose');

const MongooseObjectIdValidation = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      msg: 'Please provide valid id',
    });
  }

  next();
};

module.exports = MongooseObjectIdValidation;
