const BootcampRouter = require('express').Router();
const BootcampController = require('../controllers/Bootcamp');

BootcampRouter.route('/')
  .get(BootcampController.getBootcamps)
  .post(BootcampController.addBootcamp);
BootcampRouter.route('/:id')
  .get(BootcampController.getBootcamp)
  .put(BootcampController.updateBootcamp)
  .delete(BootcampController.deleteBootcamp);

module.exports = BootcampRouter;
