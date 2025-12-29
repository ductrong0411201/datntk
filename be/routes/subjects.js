const express = require("express");
const router = express.Router();
const subjectController = require("../src/controllers/SubjectController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/subjects", auth, checkPermission(RESOURCE_TYPES.SUBJECT, "READ"), subjectController.list);
router.get("/subjects/:id", auth, checkPermission(RESOURCE_TYPES.SUBJECT, "READ"), subjectController.getById);
router.post("/subjects", auth, checkPermission(RESOURCE_TYPES.SUBJECT, "CREATE"), subjectController.create);
router.put("/subjects/:id", auth, checkPermission(RESOURCE_TYPES.SUBJECT, "UPDATE"), subjectController.update);
router.delete("/subjects/:id", auth, checkPermission(RESOURCE_TYPES.SUBJECT, "DELETE"), subjectController.remove);

module.exports = router;

