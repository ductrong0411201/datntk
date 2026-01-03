const express = require("express");
const router = express.Router();
const courseController = require("../src/controllers/CourseController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.get("/courses", auth, checkPermission(RESOURCE_TYPES.COURSE, "READ"), courseController.list);
router.get("/courses/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "READ"), courseController.getById);
router.post("/courses", auth, checkPermission(RESOURCE_TYPES.COURSE, "CREATE"), courseController.create);
router.put("/courses/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "UPDATE"), courseController.update);
router.delete("/courses/:id", auth, checkPermission(RESOURCE_TYPES.COURSE, "DELETE"), courseController.remove);

router.get("/courses/:id/students", auth, checkPermission(RESOURCE_TYPES.COURSE, "READ"), courseController.getStudents);
router.post("/courses/:id/students", auth, checkPermission(RESOURCE_TYPES.COURSE, "UPDATE"), courseController.addStudent);
router.delete("/courses/:id/students/:student_id", auth, checkPermission(RESOURCE_TYPES.COURSE, "UPDATE"), courseController.removeStudent);

module.exports = router;

