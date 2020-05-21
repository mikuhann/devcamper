const AuthRouter = require('express').Router();
const AuthController = require('../controllers/Auth');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');

AuthRouter.route('/register')
  .post(asyncMiddleware(AuthController.register));

module.exports = AuthRouter;
