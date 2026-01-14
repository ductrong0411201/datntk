const express = require("express");
const auth = require("../src/middlewares/authorizeMiddleware");
const permissionController = require("../src/controllers/PermissionController");

const router = express.Router();

router.get("/permissions", auth, permissionController.list);

module.exports = router;
