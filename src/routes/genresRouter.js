const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresControllers');
const { 
  saveFile, 
  haltOnTimedout 
} = require('../middleware/fileUploader');
var timeout = require('connect-timeout');

genresRouter.get('/', genresController.getAllGenres);

genresRouter.post('/new',
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
  genresController.postCreateGenre);

genresRouter.get('/:id', genresController.getSpecificGenre);

genresRouter.get('/:id/update', genresController.getUpdateGenre);
genresRouter.post('/:id/update', 
  timeout('5s'), 
  haltOnTimedout, 
  function (req, res, next) {
    saveFile(req, res, function (err) {
      if (err) {
        console.log('genre error did get delivered');
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
  genresController.postUpdateGenre);

genresRouter.get('/:id/delete', genresController.getDeleteGenre);

module.exports = genresRouter;