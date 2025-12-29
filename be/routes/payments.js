const express = require("express");
const router = express.Router();
const paymentController = require("../src/controllers/PaymentController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/payments", auth, checkPermission(RESOURCE_TYPES.PAYMENT, "READ"), paymentController.list);
router.get("/payments/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT, "READ"), paymentController.getById);
router.post("/payments", auth, checkPermission(RESOURCE_TYPES.PAYMENT, "CREATE"), paymentController.create);
router.put("/payments/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT, "UPDATE"), paymentController.update);
router.delete("/payments/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT, "DELETE"), paymentController.remove);

module.exports = router;

