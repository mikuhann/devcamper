const BootcampRouter = require('express').Router();
const BootcampController = require('../controllers/Bootcamp');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const QueryMiddleware = require('../middlewares/QueryMiddleware');
const Bootcamp = require('../models/Bootcamp');
const { protectRoute } = require('../middlewares/Auth');

BootcampRouter.route('/')
  .get(
    QueryMiddleware(Bootcamp, 'courses'),
    asyncMiddleware(BootcampController.getBootcamps)
  )
  .post(protectRoute, asyncMiddleware(BootcampController.addBootcamp));
BootcampRouter.route('/:id')
  .get(asyncMiddleware(BootcampController.getBootcamp))
  .put(protectRoute, asyncMiddleware(BootcampController.updateBootcamp))
  .delete(protectRoute, asyncMiddleware(BootcampController.deleteBootcamp));
BootcampRouter.route('/:bootcampId/courses')
  .get(asyncMiddleware(BootcampController.getCoursesByBootcampId))
  .post(protectRoute, asyncMiddleware(BootcampController.addCourseToBootcamp));
BootcampRouter.route('/radius/:zipcode/:distance').get(
  asyncMiddleware(BootcampController.getBootcampsWithGeoData)
);
BootcampRouter.route('/:id/photo').put(
  asyncMiddleware(protectRoute, BootcampController.uploadBootcampImage)
);

module.exports = BootcampRouter;
