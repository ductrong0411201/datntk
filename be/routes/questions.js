const express = require("express");
const router = express.Router();
const questionController = require("../src/controllers/QuestionController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/courses/:courseId/questions", auth, questionController.getByCourseId);
router.get("/questions", auth, questionController.list);
router.get("/questions/:id", auth, questionController.getById);
router.post("/questions", auth, questionController.create);
router.put("/questions/:id", auth, questionController.update);
router.delete("/questions/:id", auth, questionController.remove);

module.exports = router;

