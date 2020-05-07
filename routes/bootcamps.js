const BootcampRouter = require('express').Router();
const BootcampController = require('../controllers/Bootcamp');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');

BootcampRouter.route('/')
  .get(asyncMiddleware(BootcampController.getBootcamps))
  .post(asyncMiddleware(BootcampController.addBootcamp));
BootcampRouter.route('/:id')
  .get(asyncMiddleware(BootcampController.getBootcamp))
  .put(asyncMiddleware(BootcampController.updateBootcamp))
  .delete(asyncMiddleware(BootcampController.deleteBootcamp));
BootcampRouter.route('/:bootcampId/courses')
  .get(asyncMiddleware(BootcampController.getCoursesByBootcampId))
  .post(asyncMiddleware(BootcampController.addCourseToBootcamp));
BootcampRouter.route('/radius/:zipcode/:distance').get(
  asyncMiddleware(BootcampController.getBootcampsWithGeoData)
);
BootcampRouter.route('/:id/photo')
  .put(asyncMiddleware(BootcampController.uploadBootcampImage));

module.exports = BootcampRouter;
