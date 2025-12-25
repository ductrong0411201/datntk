const express = require("express");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const permissionController = require("../src/controllers/PermissionController");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

const router = express.Router();

router.get("/permissions", auth, checkPermission(RESOURCE_TYPES.ROLE, "READ"), permissionController.list);

module.exports = router;
