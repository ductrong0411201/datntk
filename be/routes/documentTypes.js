const express = require("express");
const router = express.Router();
const documentTypeController = require("../src/controllers/DocumentTypeController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/document-types", auth, documentTypeController.list);
router.get("/document-types/:id", auth, documentTypeController.getById);
router.post("/document-types", auth, documentTypeController.create);
router.put("/document-types/:id", auth, documentTypeController.update);
router.delete("/document-types/:id", auth, documentTypeController.remove);

module.exports = router;

