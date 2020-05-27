const AuthRouter = require('express').Router();
const AuthController = require('../controllers/Auth');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const { protectRoute } = require('../middlewares/Auth');

AuthRouter.route('/register').post(asyncMiddleware(AuthController.register));

AuthRouter.route('/login').post(asyncMiddleware(AuthController.login));

AuthRouter.route('/me').get(
  protectRoute,
  asyncMiddleware(AuthController.getCurrentUser)
);

AuthRouter.route('/forgotpassword').post(
  asyncMiddleware(AuthController.forgotPassword)
);

module.exports = AuthRouter;
