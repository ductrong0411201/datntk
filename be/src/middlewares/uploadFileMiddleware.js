const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ALLOWED_FILE_TYPES = {
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedExtensions = [".doc", ".docx", ".pdf", ".png", ".jpg", ".jpeg", ".xls", ".xlsx"];
  
  if (ALLOWED_FILE_TYPES[fileType] && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Định dạng file không được hỗ trợ. Chỉ chấp nhận: doc, docx, pdf, png, jpg, jpeg, xls, xlsx"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

const uploadFileMiddleware = upload.single("file");

module.exports = uploadFileMiddleware;

