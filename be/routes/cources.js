const express = require("express");
const router = express.Router();
const courceController = require("../src/controllers/CourceController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/cources", auth, checkPermission(RESOURCE_TYPES.COURSE, "READ"), courceController.list);
router.get("/cources/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "READ"), courceController.getById);
router.post("/cources", auth, checkPermission(RESOURCE_TYPES.COURSE, "CREATE"), courceController.create);
router.put("/cources/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "UPDATE"), courceController.update);
router.delete("/cources/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "DELETE"), courceController.remove);

module.exports = router;

