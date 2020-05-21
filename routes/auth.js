const AuthRouter = require('express').Router();
const AuthController = require('../controllers/Auth');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');

AuthRouter.route('/register')
  .post(asyncMiddleware(AuthController.register));

AuthRouter.route('/login')
  .post(asyncMiddleware(AuthController.login));

module.exports = AuthRouter;
