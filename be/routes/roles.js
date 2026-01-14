const express = require("express");
const auth = require("../src/middlewares/authorizeMiddleware");
const roleController = require("../src/controllers/RoleController");

const router = express.Router();

router.get("/roles", auth, roleController.list);
router.get("/roles/:id", auth, roleController.getById);
router.post("/roles", auth, roleController.create);
router.put("/roles/:id", auth, roleController.update);
router.delete("/roles/:id", auth, roleController.remove);

module.exports = router;

