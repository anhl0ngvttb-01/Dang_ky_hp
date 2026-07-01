const express = require("express");
const CurriculumController = require("../../controllers/admin/CurriculumController");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

router.use(adminAuth);
router.get("/subjects", CurriculumController.listSubjects);
router.post("/subjects", CurriculumController.createSubject);
router.get("/semesters", CurriculumController.listSemesters);
router.post("/semesters", CurriculumController.createSemester);
router.get("/courses", CurriculumController.listCourses);
router.post("/courses", CurriculumController.createCourse);

module.exports = router;
