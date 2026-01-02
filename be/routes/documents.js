const express = require("express");
const router = express.Router();
const multer = require("multer");
const documentController = require("../src/controllers/DocumentController");
const uploadFileMiddleware = require("../src/middlewares/uploadFileMiddleware");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.post(
  "/documents/upload",
  auth,
  checkPermission(RESOURCE_TYPES.DOCUMENT, "CREATE"),
  (req, res, next) => {
    uploadFileMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              status: 400,
              message: "Kích thước file vượt quá 50MB",
              data: null
            });
          }
          return res.status(400).json({
            status: 400,
            message: err.message || "Lỗi upload file",
            data: null
          });
        }
        return res.status(400).json({
          status: 400,
          message: err.message || "Lỗi upload file",
          data: null
        });
      }
      next();
    });
  },
  documentController.upload
);

module.exports = router;

