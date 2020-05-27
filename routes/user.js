const UserRouter = require('express').Router();
const UserController = require('../controllers/User');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const { protectRoute } = require('../middlewares/Auth');

UserRouter.route('/update').put(
  protectRoute,
  asyncMiddleware(UserController.updateProfile)
);

module.exports = UserRouter;
