const express = require("express");
const router = express.Router();
const documentTypeController = require("../src/controllers/DocumentTypeController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/document-types", auth, checkPermission(RESOURCE_TYPES.DOCUMENT_TYPE, "READ"), documentTypeController.list);
router.get("/document-types/:id", auth, checkPermission(RESOURCE_TYPES.DOCUMENT_TYPE, "READ"), documentTypeController.getById);
router.post("/document-types", auth, checkPermission(RESOURCE_TYPES.DOCUMENT_TYPE, "CREATE"), documentTypeController.create);
router.put("/document-types/:id", auth, checkPermission(RESOURCE_TYPES.DOCUMENT_TYPE, "UPDATE"), documentTypeController.update);
router.delete("/document-types/:id", auth, checkPermission(RESOURCE_TYPES.DOCUMENT_TYPE, "DELETE"), documentTypeController.remove);

module.exports = router;

