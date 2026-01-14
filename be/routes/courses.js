const express = require("express");
const router = express.Router();
const courseController = require("../src/controllers/CourseController");
const auth = require("../src/middlewares/authorizeMiddleware");

router.get("/courses", courseController.list);
router.get("/courses/my-courses", auth, courseController.getMyCourses);
router.get("/courses/:id", courseController.getById);
router.post("/courses", auth, courseController.create);
router.put("/courses/:id", auth, courseController.update);
router.delete("/courses/:id", auth, courseController.remove);

router.get("/courses/:id/students", auth, courseController.getStudents);
router.post("/courses/:id/students", auth, courseController.addStudent);
router.post("/courses/:id/register-payment", auth, courseController.registerWithPayment);
router.delete("/courses/:id/students/:student_id", auth, courseController.removeStudent);

module.exports = router;

