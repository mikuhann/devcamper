const BootcampRouter = require('express').Router();
const BootcampController = require('../controllers/Bootcamp');
const { asyncMiddleware } = require('../middlewares/AsyncMiddleware');
const MongooseObjectIdValidation = require('../middlewares/MongoseIdValidation');

BootcampRouter.route('/')
  .get(asyncMiddleware(BootcampController.getBootcamps))
  .post(asyncMiddleware(BootcampController.addBootcamp));
BootcampRouter.route('/:id')
  .get(MongooseObjectIdValidation, asyncMiddleware(BootcampController.getBootcamp))
  .put(MongooseObjectIdValidation, asyncMiddleware(BootcampController.updateBootcamp))
  .delete(MongooseObjectIdValidation, asyncMiddleware(BootcampController.deleteBootcamp));

module.exports = BootcampRouter;
