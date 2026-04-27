const { Router } = require('express');
const indexRouter = Router();
const homeController = require('../controllers/indexController');

indexRouter.get('/', homeController.getHomepage);

indexRouter.get('/search', homeController.getSearchedProduct);

module.exports = indexRouter;