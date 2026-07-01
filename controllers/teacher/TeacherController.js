const TeacherProfileModel = require("../../models/teacher/TeacherProfileModel");
const CourseTeachingModel = require("../../models/teacher/CourseTeachingModel");

const TeacherController = {
  async dashboard(req, res) {
    return res.render("teacher/dashboard", {
      title: "Dashboard giảng viên",
      user: req.session.user,
    });
  },

  async profile(req, res) {
    try {
      const teacher = await TeacherProfileModel.getByUserId(req.session.user.maNguoiDung);
      return res.render("teacher/profile", {
        title: "Hồ sơ giảng viên",
        teacher,
        error: null,
        success: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("teacher/profile", {
        title: "Hồ sơ giảng viên",
        teacher: null,
        error: "Không thể tải hồ sơ giảng viên.",
        success: null,
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const teacher = await TeacherProfileModel.getByUserId(req.session.user.maNguoiDung);
      if (!teacher) return res.redirect("/teacher/profile");

      await TeacherProfileModel.updateProfile(teacher.ma_giang_vien_id, req.body);
      return res.redirect("/teacher/profile");
    } catch (error) {
      console.error(error);
      const teacher = await TeacherProfileModel.getByUserId(req.session.user.maNguoiDung);
      return res.status(500).render("teacher/profile", {
        title: "Hồ sơ giảng viên",
        teacher,
        error: "Cập nhật hồ sơ thất bại.",
        success: null,
      });
    }
  },

  async courses(req, res) {
    try {
      const teacher = await TeacherProfileModel.getByUserId(req.session.user.maNguoiDung);
      const courses = teacher
        ? await CourseTeachingModel.getByTeacher(teacher.ma_giang_vien_id)
        : [];
      return res.render("teacher/courses", {
        title: "Lớp học phần",
        courses,
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("teacher/courses", {
        title: "Lớp học phần",
        courses: [],
        error: "Không thể tải danh sách lớp học phần.",
      });
    }
  },

  async updateCourseStatus(req, res) {
    try {
      await CourseTeachingModel.updateStatus(req.params.maHocPhanId, req.body.trangThai);
      return res.redirect("/teacher/courses");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Cập nhật trạng thái thất bại." });
    }
  },
};

module.exports = TeacherController;
