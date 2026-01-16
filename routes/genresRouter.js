const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresControllers');

genresRouter.get('/new', genresController.getCreateGenre);
genresRouter.post('/new', genresController.postCreateGenre);

genresRouter.get('/:id', genresController.getSpecificGenre);

genresRouter.get('/:id/update', genresController.getUpdateGenre);
genresRouter.post('/:id/update', genresController.postUpdateGenre);

genresRouter.get('/:id/delete', genresController.getDeleteGenre);

module.exports = genresRouter;