const StudentProfileModel = require("../../models/student/StudentProfileModel");
const RegistrationModel = require("../../models/student/RegistrationModel");
const RegistrationDetailModel = require("../../models/student/RegistrationDetailModel");
const SemesterModel = require("../../models/student/SemesterModel");
const StudentCourseModel = require("../../models/student/StudentCourseModel");

const StudentController = {
  async dashboard(req, res) {
    return res.render("student/dashboard", {
      title: "Dashboard sinh viên",
      user: req.session.user,
    });
  },

  async profile(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(req.session.user.maNguoiDung);
      return res.render("student/profile", {
        title: "Hồ sơ sinh viên",
        student,
        error: null,
        success: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("student/profile", {
        title: "Hồ sơ sinh viên",
        student: null,
        error: "Không thể tải hồ sơ sinh viên.",
        success: null,
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(req.session.user.maNguoiDung);
      if (!student) return res.redirect("/student/profile");

      await StudentProfileModel.updateProfile(student.ma_sinh_vien_id, req.body);
      return res.redirect("/student/profile");
    } catch (error) {
      console.error(error);
      const student = await StudentProfileModel.getByUserId(req.session.user.maNguoiDung);
      return res.status(500).render("student/profile", {
        title: "Hồ sơ sinh viên",
        student,
        error: "Cập nhật hồ sơ thất bại.",
        success: null,
      });
    }
  },

  async getRegistrationPage(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(req.session.user.maNguoiDung);
      const semesters = await SemesterModel.getAll();
      const selectedSemesterId = Number(req.query.maHocKy || semesters[0]?.ma_hoc_ky_id || 0);
      const registration = selectedSemesterId
        ? await RegistrationModel.getCurrentByStudentAndSemester(student.ma_sinh_vien_id, selectedSemesterId)
        : null;
      const registrationDetails = registration
        ? await RegistrationDetailModel.getByRegistration(registration.ma_dang_ky)
        : [];
      const courses = selectedSemesterId
        ? await StudentCourseModel.getOpenBySemester(selectedSemesterId)
        : [];

      return res.render("student/registrations", {
        title: "Đăng ký học phần",
        student,
        semesters,
        selectedSemesterId,
        registration,
        registrationDetails,
        courses,
        error: null,
        success: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("student/registrations", {
        title: "Đăng ký học phần",
        student: null,
        semesters: [],
        selectedSemesterId: null,
        registration: null,
        registrationDetails: [],
        courses: [],
        error: "Không thể tải dữ liệu đăng ký.",
        success: null,
      });
    }
  },

  async createRegistration(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(req.session.user.maNguoiDung);
      const { maHocKy, maHocPhan } = req.body;

      let registration = await RegistrationModel.getCurrentByStudentAndSemester(student.ma_sinh_vien_id, maHocKy);
      if (!registration) {
        const newRegistrationId = await RegistrationModel.create({
          maSinhVien: student.ma_sinh_vien_id,
          maHocKy,
          tongTinChi: 0,
        });
        registration = { ma_dang_ky: newRegistrationId };
      }

      await RegistrationDetailModel.create({
        maDangKy: registration.ma_dang_ky,
        maHocPhan,
      });

      return res.redirect(`/student/registrations?maHocKy=${maHocKy}`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Đăng ký học phần thất bại. Có thể bạn đã đăng ký lớp này rồi.",
      });
    }
  },

  async cancelRegistration(req, res) {
    try {
      await RegistrationDetailModel.updateStatus(req.params.maChiTiet, "da_huy");
      return res.redirect("/student/registrations");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Hủy đăng ký thất bại." });
    }
  },
};

module.exports = StudentController;
