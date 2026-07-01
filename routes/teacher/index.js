const express = require("express");
const TeacherController = require("../../controllers/teacher/TeacherController");
const teacherAuth = require("../../middleware/teacherAuth");

const router = express.Router();

router.use(teacherAuth);
router.get("/", (req, res) => res.redirect("/teacher/dashboard"));
router.get("/dashboard", TeacherController.dashboard);
router.get("/profile", TeacherController.profile);
router.post("/profile", TeacherController.updateProfile);
router.get("/courses", TeacherController.courses);
router.post("/courses/status/:maHocPhanId", TeacherController.updateCourseStatus);

module.exports = router;
