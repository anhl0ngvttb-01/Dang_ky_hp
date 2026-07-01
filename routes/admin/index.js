const express = require("express");
const AdminController = require("../../controllers/admin/AdminController");
const CurriculumController = require("../../controllers/admin/CurriculumController");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

router.use(adminAuth);
router.get("/dashboard", AdminController.dashboard);
router.get("/students", AdminController.listStudents);
router.get("/teachers", AdminController.listTeachers);
router.get("/subjects", CurriculumController.listSubjects);
router.post("/subjects", CurriculumController.createSubject);
router.get("/semesters", CurriculumController.listSemesters);
router.post("/semesters", CurriculumController.createSemester);
router.get("/courses", CurriculumController.listCourses);
router.post("/courses", CurriculumController.createCourse);

module.exports = router;
