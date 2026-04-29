const multer = require('multer');

const fileFilter = (req, file, cb) => {
  ( file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/svg+xml'
  ) ? cb(null, true) : cb(new Error('Incorrect file format provided.'), false);  
};

const storage = multer.memoryStorage();

const uploadMiddleware = multer({ 
  fileFilter: fileFilter,
  storage: storage, 
}).single('file');

const processingResults = (req, res, err) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    console.log('multer error');
    console.log(err);
    return err;
  } else if (err) {
    // An unknown error occurred when uploading.
    console.log('unknown error');
    console.log(err);
    return err;
  } else {
    // Everything went fine.
    console.log('no error');
    return req.file;
  };
};

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
};

async function saveFile (req, res, cb) {
  let results;
  await uploadMiddleware(req, res, (err) => {
    results = processingResults(req, res, err);
    // console.log('results: ', results);
  });

  setTimeout(function () {
    let err = null;
    if (results instanceof Error) {
      err = results;
    } else err = null;
    // console.log('results: ', results);
    cb(err);
  }, 1000);
};

module.exports = {
    saveFile,
    haltOnTimedout
};