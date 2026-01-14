const express = require("express");
const router = express.Router();
const subjectController = require("../src/controllers/SubjectController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/subjects", auth, subjectController.list);
router.get("/subjects/:id", auth, subjectController.getById);
router.post("/subjects", auth, subjectController.create);
router.put("/subjects/:id", auth, subjectController.update);
router.delete("/subjects/:id", auth, subjectController.remove);

module.exports = router;

