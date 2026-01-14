const express = require("express");
const router = express.Router();
const paymentMethodController = require("../src/controllers/PaymentMethodController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/payment-methods", auth, paymentMethodController.list);
router.get("/payment-methods/:id", auth, paymentMethodController.getById);
router.post("/payment-methods", auth, paymentMethodController.create);
router.put("/payment-methods/:id", auth, paymentMethodController.update);
router.delete("/payment-methods/:id", auth, paymentMethodController.remove);

module.exports = router;

