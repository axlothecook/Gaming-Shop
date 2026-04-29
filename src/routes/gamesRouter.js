const { Router } = require('express');
const gamesRouter = Router();
const gamesControllers = require('../controllers/gamesControllers');
const paginate = require('../middleware/paginate');
const { 
  saveFile, 
  haltOnTimedout 
} = require('../middleware/fileUploader');
var timeout = require('connect-timeout');


gamesRouter.get('/', paginate(), gamesControllers.getProducts);

gamesRouter.get('/new', gamesControllers.getNewProduct);
gamesRouter.post('/new', 
  timeout('5s'), 
  haltOnTimedout, 
  function (req, res, next) {
    saveFile(req, res, function (err) {
      if (err) {
        console.log('initial game upload error did get delivered');
        console.log(err instanceof Error)
        console.log(err.message);
        req.err = err.message;
      }
      if (req.timedout) {
        err = {
          statusCode: 408,
          message: 'The server timed out waiting for the request.'
        };
        return next(err)
      };
      next();
    });
  }, 
  gamesControllers.postNewProduct);

gamesRouter.get('/:id', gamesControllers.getIndividualProduct);
gamesRouter.get('/:id/update', gamesControllers.getUpdateProduct);
gamesRouter.post('/:id/update',
  timeout('5s'), 
  haltOnTimedout, 
  function (req, res, next) {
    saveFile(req, res, function (err) {
      if (err) {
        console.log('game update error did get delivered');
        console.log(err.message);
        req.err = err.message;
      }
      if (req.timedout) {
        err = {
          statusCode: 408,
          message: 'The server timed out waiting for the request.'
        };
        return next(err)
      };
      next();
    });
  }, 
  gamesControllers.postUpdateProduct);

gamesRouter.get('/:id/delete', gamesControllers.getDeleteProduct);

module.exports = gamesRouter;