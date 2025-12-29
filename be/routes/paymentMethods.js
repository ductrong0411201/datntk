const express = require("express");
const router = express.Router();
const paymentMethodController = require("../src/controllers/PaymentMethodController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/payment-methods", auth, checkPermission(RESOURCE_TYPES.PAYMENT_METHOD, "READ"), paymentMethodController.list);
router.get("/payment-methods/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT_METHOD, "READ"), paymentMethodController.getById);
router.post("/payment-methods", auth, checkPermission(RESOURCE_TYPES.PAYMENT_METHOD, "CREATE"), paymentMethodController.create);
router.put("/payment-methods/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT_METHOD, "UPDATE"), paymentMethodController.update);
router.delete("/payment-methods/:id", auth, checkPermission(RESOURCE_TYPES.PAYMENT_METHOD, "DELETE"), paymentMethodController.remove);

module.exports = router;

