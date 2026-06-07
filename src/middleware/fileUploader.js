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

// 3.5MB cap, matched on the frontend by adapter-node's BODY_SIZE_LIMIT. The
// frontend rejects anything larger before it reaches here; this is the backend
// backstop so an oversized file yields a clean LIMIT_FILE_SIZE error, not a hang.
const MAX_FILE_SIZE = 3500000;

const uploadMiddleware = multer({
  fileFilter: fileFilter,
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('file');

const processingResults = (req, res, err) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading. Give a friendlier message for the
    // size limit specifically (LIMIT_FILE_SIZE) since users will hit it most.
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new Error('Image is too large. Maximum size is 3.5MB.');
    }
    return err;
  } else if (err) {
    // An unknown error occurred when uploading.
    return err;
  } else {
    // Everything went fine.
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
  });

  setTimeout(function () {
    let err = null;
    if (results instanceof Error) {
      err = results;
    } else err = null;
    cb(err);
  }, 1000);
};

module.exports = {
    saveFile,
    haltOnTimedout
};