const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersControllers');
const { 
  saveFile, 
  haltOnTimedout 
} = require('../middleware/fileUploader');
var timeout = require('connect-timeout');

developersRouter.get('/', developersController.getAllDevelopers);
developersRouter.get('/new', developersController.getCreateDeveloper);
developersRouter.post('/new',
  timeout('5s'), 
  haltOnTimedout, 
  function (req, res, next) {
    saveFile(req, res, function (err) {
      if (err) {
        console.log('error did get delivered');
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
  developersController.postCreateDeveloper);

developersRouter.get('/:id', developersController.getSpecificDeveloper);

developersRouter.get('/:id/update', developersController.getUpdateDeveloper);
developersRouter.post('/:id/update', 
  timeout('5s'), 
  haltOnTimedout, 
  function (req, res, next) {
    saveFile(req, res, function (err) {
      if (err) {
        console.log('dev error did get delivered');
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
  developersController.postUpdateDeveloper);

developersRouter.get('/:id/delete', developersController.getDeleteDeveloper);

module.exports = developersRouter;