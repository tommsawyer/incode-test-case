const multer              = require('multer');
const mime                = require('mime');
const SHA256              = require('crypto-js/sha256');
const JSONError           = require('./json_error');
const { WRONG_MIME_TYPE } = require('./strings/strings');

const ProfilePhotoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, __dirname + '/../public/');
  },

  filename(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimeTypes.indexOf(file.mimetype) === -1) {
      return cb(new JSONError(WRONG_MIME_TYPE, 400));
    }

    cb(null, `${SHA256(Date.now().toString())}.${mime.extension(file.mimetype)}`);
  }
});

const uploadMiddleware = multer({
  storage: ProfilePhotoStorage,
  limits: {
    fileSize: 2097152 // 2Mb in bytes
  }
});

module.exports = function(req, res, next) {
  uploadMiddleware.single('profile_photo')(req, res, err => {
    if (!err) {
      return next();
    }

    if (err instanceof JSONError) {
      return next(err);
    }

    next(new JSONError(err.message, 400));
  });
};
