const express = require("express");
const router = express.Router();
const authController = require("../src/controllers/AuthController");
const userController = require("../src/controllers/UserController");
const auth = require("../src/middlewares/authorizeMiddleware");
const valid = require("../src/middlewares/validationInfo");

router.post("/register", valid, authController.register);
router.post("/login", valid, authController.login);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.getUserInfo);

router.get("/users", auth, userController.list);
router.get("/users/teachers", auth, userController.getTeachers);
router.get("/users/teachers/:id", auth, userController.getTeacherById);
router.post("/users/teachers", auth, userController.createTeacher);
router.put("/users/teachers/:id", auth, userController.updateTeacher);
router.put("/users/teachers/:id/password", auth, userController.changeTeacherPassword);
router.delete("/users/teachers/:id", auth, userController.deleteTeacher);
router.get("/users/students", auth, userController.getStudents);
router.get("/users/students/:id", auth, userController.getStudentById);
router.post("/users/students", auth, userController.createStudent);
router.put("/users/students/:id", auth, userController.updateStudent);
router.put("/users/students/:id/password", auth, userController.changeStudentPassword);
router.delete("/users/students/:id", auth, userController.deleteStudent);
router.get("/users/:id", auth, userController.getById);
router.post("/users", auth, userController.create);
router.put("/users/:id", auth, userController.update);
router.put("/users/:id/password", auth, userController.changePassword);
router.delete("/users/:id", auth, userController.remove);

module.exports = router;
