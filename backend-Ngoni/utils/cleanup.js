const fs = require("fs");
const path = require("path");

exports.cleanupUploads = () => {
  const uploadDir = path.join(__dirname, "../uploads");
  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error("Cleanup error:", err);
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", filePath, err);
        else console.log("Deleted old upload:", filePath);
      });
    });
  });
};
