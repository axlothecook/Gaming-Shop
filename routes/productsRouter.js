const { Router } = require('express');
const productsRouter = Router();
const productsControllers = require('../controllers/productsControllers');

productsRouter.get('/', productsControllers.getProducts);

productsRouter.get('/new', productsControllers.getNewProduct);
productsRouter.post('/new', productsControllers.postNewProduct);

productsRouter.get('/:id', productsControllers.getIndividualProduct);
productsRouter.get('/:id/update', productsControllers.getUpdateProduct);
productsRouter.post('/:id/update', productsControllers.postUpdateProduct);

productsRouter.get('/:id/delete', productsControllers.getDeleteProduct);

module.exports = productsRouter;