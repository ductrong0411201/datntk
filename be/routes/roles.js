const express = require("express");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const roleController = require("../src/controllers/RoleController");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

const router = express.Router();

router.get("/roles", auth, checkPermission(RESOURCE_TYPES.ROLE, "READ"), roleController.list);
router.get("/roles/:id", auth, checkPermission(RESOURCE_TYPES.ROLE, "READ"), roleController.getById);
router.post("/roles", auth, checkPermission(RESOURCE_TYPES.ROLE, "CREATE"), roleController.create);
router.put("/roles/:id", auth, checkPermission(RESOURCE_TYPES.ROLE, "UPDATE"), roleController.update);
router.delete("/roles/:id", auth, checkPermission(RESOURCE_TYPES.ROLE, "DELETE"), roleController.remove);

module.exports = router;

