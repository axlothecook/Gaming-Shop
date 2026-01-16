const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersControllers');

developersRouter.get('/new', developersController.getCreateDeveloper);
developersRouter.post('/new', developersController.postCreateDeveloper);

developersRouter.get('/:id', developersController.getSpecificDeveloper);

developersRouter.get('/:id/update', developersController.getUpdateDeveloper);
developersRouter.post('/:id/update', developersController.postUpdateDeveloper);

developersRouter.get('/:id/delete', developersController.getDeleteDeveloper);

module.exports = developersRouter;