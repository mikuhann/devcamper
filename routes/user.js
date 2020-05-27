const UserRouter = require('express').Router();
const UserController = require('../controllers/User');
const User = require('../models/User');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const { protectRoute, checkRole } = require('../middlewares/Auth');
const QueryMiddleware = require('../middlewares/QueryMiddleware');
const { roles } = require('../constants/Roles');

UserRouter.use(protectRoute);

UserRouter.route('/update').put(asyncMiddleware(UserController.updateProfile));

UserRouter.route('/')
  .get(
    QueryMiddleware(User),
    checkRole(roles.ADMIN),
    asyncMiddleware(UserController.getAllUsers)
  )
  .post(checkRole(roles.ADMIN), asyncMiddleware(UserController.createUser));

UserRouter.route('/:id')
  .get(checkRole(roles.ADMIN), asyncMiddleware(UserController.getUser))
  .put(checkRole(roles.ADMIN), asyncMiddleware(UserController.updateUser))
  .delete(checkRole(roles.ADMIN), asyncMiddleware(UserController.deleteUser));

module.exports = UserRouter;
