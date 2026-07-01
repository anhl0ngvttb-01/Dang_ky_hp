const express = require("express");
const AdminController = require("../../controllers/admin/AdminController");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

router.use(adminAuth);
router.get("/dashboard", AdminController.dashboard);
router.get("/students", AdminController.listStudents);
router.get("/teachers", AdminController.listTeachers);

module.exports = router;
