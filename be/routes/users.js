const express = require("express");
const router = express.Router();
const authController = require("../src/controllers/AuthController");
const userController = require("../src/controllers/UserController");
const auth = require("../src/middlewares/authorizeMiddleware");
const checkPermission = require("../src/middlewares/checkPermissionMiddleware");
const valid = require("../src/middlewares/validationInfo");
const RESOURCE_TYPES = require("../src/constants/resourceTypes");

router.post("/register", valid, authController.register);
router.post("/login", valid, authController.login);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.getUserInfo);

router.get("/users", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.list);
router.get("/users/teachers", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.getTeachers);
router.get("/users/teachers/:id", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.getTeacherById);
router.post("/users/teachers", auth, checkPermission(RESOURCE_TYPES.USER, "CREATE"), userController.createTeacher);
router.put("/users/teachers/:id", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.updateTeacher);
router.put("/users/teachers/:id/password", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.changeTeacherPassword);
router.delete("/users/teachers/:id", auth, checkPermission(RESOURCE_TYPES.USER, "DELETE"), userController.deleteTeacher);
router.get("/users/students", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.getStudents);
router.get("/users/students/:id", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.getStudentById);
router.post("/users/students", auth, checkPermission(RESOURCE_TYPES.USER, "CREATE"), userController.createStudent);
router.put("/users/students/:id", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.updateStudent);
router.put("/users/students/:id/password", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.changeStudentPassword);
router.delete("/users/students/:id", auth, checkPermission(RESOURCE_TYPES.USER, "DELETE"), userController.deleteStudent);
router.get("/users/:id", auth, checkPermission(RESOURCE_TYPES.USER, "READ"), userController.getById);
router.post("/users", auth, checkPermission(RESOURCE_TYPES.USER, "CREATE"), userController.create);
router.put("/users/:id", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.update);
router.put("/users/:id/password", auth, checkPermission(RESOURCE_TYPES.USER, "UPDATE"), userController.changePassword);
router.delete("/users/:id", auth, checkPermission(RESOURCE_TYPES.USER, "DELETE"), userController.remove);

module.exports = router;
