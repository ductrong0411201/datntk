const express = require("express");
const router = express.Router();
const paymentController = require("../src/controllers/PaymentController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/payments", auth, paymentController.list);
router.get("/payments/:id", auth, paymentController.getById);
router.post("/payments", auth, paymentController.create);
router.put("/payments/:id", auth, paymentController.update);
router.delete("/payments/:id", auth, paymentController.remove);

module.exports = router;

