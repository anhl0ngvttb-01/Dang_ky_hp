const SubjectModel = require("../../models/admin/SubjectModel");
const SemesterModel = require("../../models/admin/SemesterModel");
const CourseModel = require("../../models/admin/CourseModel");

const CurriculumController = {
  async listSubjects(req, res) {
    try {
      const subjects = await SubjectModel.getAll();
      return res.render("admin/subjects", { title: "Quản lý môn học", subjects, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/subjects", {
        title: "Quản lý môn học",
        subjects: [],
        error: "Không thể tải danh sách môn học.",
      });
    }
  },

  async createSubject(req, res) {
    try {
      await SubjectModel.create(req.body);
      return res.redirect("/admin/subjects");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Tạo môn học thất bại." });
    }
  },

  async listSemesters(req, res) {
    try {
      const semesters = await SemesterModel.getAll();
      return res.render("admin/semesters", { title: "Quản lý học kỳ", semesters, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/semesters", {
        title: "Quản lý học kỳ",
        semesters: [],
        error: "Không thể tải danh sách học kỳ.",
      });
    }
  },

  async createSemester(req, res) {
    try {
      await SemesterModel.create(req.body);
      return res.redirect("/admin/semesters");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Tạo học kỳ thất bại." });
    }
  },

  async listCourses(req, res) {
    try {
      const courses = await CourseModel.getAll();
      return res.render("admin/courses", { title: "Quản lý lớp học phần", courses, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/courses", {
        title: "Quản lý lớp học phần",
        courses: [],
        error: "Không thể tải danh sách lớp học phần.",
      });
    }
  },

  async createCourse(req, res) {
    try {
      await CourseModel.create(req.body);
      return res.redirect("/admin/courses");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Tạo lớp học phần thất bại." });
    }
  },
};

module.exports = CurriculumController;
