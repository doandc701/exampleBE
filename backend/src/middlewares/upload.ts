import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploads = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    // console.log("file", file);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("only jpg && png supported !");
      callback(null, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 },
});

export default uploads;
