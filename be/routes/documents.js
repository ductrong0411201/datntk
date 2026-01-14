const express = require("express");
const router = express.Router();
const multer = require("multer");
const documentController = require("../src/controllers/DocumentController");
const uploadFileMiddleware = require("../src/middlewares/uploadFileMiddleware");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/documents", auth, documentController.list);
router.post(
  "/documents/upload",
  auth,
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
router.delete("/documents/:id", auth, documentController.remove);

module.exports = router;

