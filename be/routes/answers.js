const express = require("express");
const router = express.Router();
const answerController = require("../src/controllers/AnswerController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/questions/:questionId/answers", auth, answerController.list);
router.get("/answers", auth, answerController.list);
router.get("/answers/:id", auth, answerController.getById);
router.post("/answers", auth, answerController.create);
router.put("/answers/:id", auth, answerController.update);
router.delete("/answers/:id", auth, answerController.remove);

module.exports = router;

