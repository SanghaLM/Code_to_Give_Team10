const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("uploadMiddleware: Setting destination for file upload");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log("uploadMiddleware: Generated filename:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("uploadMiddleware: Checking file type:", file.mimetype);
  const allowedTypes = /mp4|mov|avi|mkv|mp3|wav/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    console.log("uploadMiddleware: Invalid file type:", file.mimetype);
    cb(new Error("Only video/audio files are allowed"));
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

module.exports = uploadMiddleware;
