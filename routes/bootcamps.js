const BootcampRouter = require('express').Router();
const BootcampController = require('../controllers/Bootcamp');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const QueryMiddleware = require('../middlewares/QueryMiddleware');
const Bootcamp = require('../models/Bootcamp');
const { protectRoute, checkRole } = require('../middlewares/Auth');
const { roles } = require('../constants/Roles');
const CheckOwnership = require('../middlewares/CheckOwnership');

BootcampRouter.route('/')
  .get(
    QueryMiddleware(Bootcamp, 'courses'),
    asyncMiddleware(BootcampController.getBootcamps)
  )
  .post(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    asyncMiddleware(BootcampController.addBootcamp)
  );
BootcampRouter.route('/:id')
  .get(asyncMiddleware(BootcampController.getBootcamp))
  .put(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Bootcamp),
    asyncMiddleware(BootcampController.updateBootcamp)
  )
  .delete(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Bootcamp),
    asyncMiddleware(BootcampController.deleteBootcamp)
  );
BootcampRouter.route('/:id/courses')
  .get(asyncMiddleware(BootcampController.getCoursesByBootcampId))
  .post(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Bootcamp),
    asyncMiddleware(BootcampController.addCourseToBootcamp)
  );
BootcampRouter.route('/radius/:zipcode/:distance').get(
  asyncMiddleware(BootcampController.getBootcampsWithGeoData)
);
BootcampRouter.route('/:id/photo').put(
  asyncMiddleware(
    protectRoute,
    checkRole(roles.ADMIN, roles.PUBLISHER),
    CheckOwnership(Bootcamp),
    BootcampController.uploadBootcampImage
  )
);

module.exports = BootcampRouter;
