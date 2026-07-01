const StudentModel = require("../../models/admin/StudentModel");
const TeacherModel = require("../../models/admin/TeacherModel");
const DashboardModel = require("../../models/admin/DashboardModel");

const AdminController = {
  async dashboard(req, res) {
    try {
      const overview = await DashboardModel.getOverview();
      return res.render("admin/dashboard", { title: "Bảng điều khiển", overview, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/dashboard", {
        title: "Bảng điều khiển",
        overview: {},
        error: "Không thể tải dashboard.",
      });
    }
  },

  async listStudents(req, res) {
    try {
      const students = await StudentModel.getAll();
      return res.render("admin/students", { title: "Quản lý sinh viên", students, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/students", {
        title: "Quản lý sinh viên",
        students: [],
        error: "Không thể tải danh sách sinh viên.",
      });
    }
  },

  async listTeachers(req, res) {
    try {
      const teachers = await TeacherModel.getAll();
      return res.render("admin/teachers", { title: "Quản lý giảng viên", teachers, error: null });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/teachers", {
        title: "Quản lý giảng viên",
        teachers: [],
        error: "Không thể tải danh sách giảng viên.",
      });
    }
  },
};

module.exports = AdminController;
