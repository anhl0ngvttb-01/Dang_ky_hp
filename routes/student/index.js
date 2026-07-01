const express = require("express");
const StudentController = require("../../controllers/student/StudentController");
const studentAuth = require("../../middlewares/studentAuth");

const router = express.Router();

router.use(studentAuth);
router.get("/", (req, res) => res.redirect("/student/dashboard"));
router.get("/dashboard", StudentController.dashboard);
router.get("/profile", StudentController.profile);
router.post("/profile", StudentController.updateProfile);
router.get("/registrations", StudentController.getRegistrationPage);
router.post("/registrations", StudentController.createRegistration);
router.post("/registrations/cancel/:maChiTiet", StudentController.cancelRegistration);

module.exports = router;
