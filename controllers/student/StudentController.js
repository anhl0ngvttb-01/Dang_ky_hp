const StudentProfileModel = require("../../models/student/StudentProfileModel");
const RegistrationModel = require("../../models/student/RegistrationModel");
const RegistrationDetailModel = require("../../models/student/RegistrationDetailModel");
const SemesterModel = require("../../models/student/SemesterModel");
const StudentCourseModel = require("../../models/student/StudentCourseModel");

const MAX_CREDITS_PER_SEMESTER =
  Number(process.env.MAX_CREDITS_PER_SEMESTER) || 24;

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function toDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const text = String(value);
  const datePart = text.includes("T") ? text.split("T")[0] : text;
  const [year, month, day] = datePart.split("-").map(Number);

  if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isTodayInRange(start, end) {
  const today = startOfToday();
  const startDate = toDateOnly(start);
  const endDate = toDateOnly(end);
  return Boolean(
    startDate && endDate && today >= startDate && today <= endDate,
  );
}

async function loadRegistrationData(req, selectedSemesterId) {
  const student = await StudentProfileModel.getByUserId(
    req.session.user.maNguoiDung,
  );
  const semesters = await SemesterModel.getAll();
  const maHocKy = Number(
    selectedSemesterId || req.query.maHocKy || semesters[0]?.ma_hoc_ky_id || 0,
  );
  const semester = maHocKy ? await SemesterModel.getById(maHocKy) : null;
  const registration =
    student && maHocKy
      ? await RegistrationModel.getCurrentByStudentAndSemester(
          student.ma_sinh_vien_id,
          maHocKy,
        )
      : null;
  const registrationDetails = registration
    ? await RegistrationDetailModel.getByRegistration(registration.ma_dang_ky)
    : [];
  const courses = maHocKy
    ? await StudentCourseModel.getOpenBySemester(maHocKy)
    : [];
  const activeCredits = registrationDetails
    .filter((item) => item.trang_thai === "da_dang_ky")
    .reduce((total, item) => total + Number(item.so_tin_chi || 0), 0);

  return {
    student,
    semesters,
    selectedSemesterId: maHocKy,
    semester,
    registration,
    registrationDetails,
    courses,
    activeCredits,
    maxCredits: MAX_CREDITS_PER_SEMESTER,
  };
}

function renderRegistrationPage(
  res,
  status,
  data,
  error = null,
  success = null,
) {
  return res.status(status).render("student/registrations", {
    title: "Đăng ký học phần",
    ...data,
    error,
    success,
  });
}

const StudentController = {
  async dashboard(req, res) {
    try {
      const data = await loadRegistrationData(req);
      const activeRegistrations = data.registrationDetails.filter(
        (item) => item.trang_thai === "da_dang_ky",
      );
      return res.render("student/dashboard", {
        title: "Dashboard sinh viên",
        user: req.session.user,
        student: data.student,
        semester: data.semester,
        activeCredits: data.activeCredits,
        registeredCourses: activeRegistrations.length,
        recentRegistrations: activeRegistrations.slice(0, 5),
        maxCredits: data.maxCredits,
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("student/dashboard", {
        title: "Dashboard sinh viên",
        user: req.session.user,
        student: null,
        semester: null,
        activeCredits: 0,
        registeredCourses: 0,
        recentRegistrations: [],
        maxCredits: MAX_CREDITS_PER_SEMESTER,
        error: "Không thể tải dashboard sinh viên.",
      });
    }
  },

  async profile(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(
        req.session.user.maNguoiDung,
      );
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
      const student = await StudentProfileModel.getByUserId(
        req.session.user.maNguoiDung,
      );
      if (!student) return res.redirect("/student/profile");

      await StudentProfileModel.updateProfile(
        student.ma_sinh_vien_id,
        req.body,
      );
      return res.redirect("/student/profile");
    } catch (error) {
      console.error(error);
      const student = await StudentProfileModel.getByUserId(
        req.session.user.maNguoiDung,
      );
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
      const data = await loadRegistrationData(req);
      return renderRegistrationPage(res, 200, data);
    } catch (error) {
      console.error(error);
      return res.status(500).render("student/registrations", {
        title: "Đăng ký học phần",
        student: null,
        semesters: [],
        selectedSemesterId: null,
        semester: null,
        registration: null,
        registrationDetails: [],
        courses: [],
        activeCredits: 0,
        maxCredits: MAX_CREDITS_PER_SEMESTER,
        error: "Không thể tải dữ liệu đăng ký.",
        success: null,
      });
    }
  },

  async createRegistration(req, res) {
    const { maHocKy, maHocPhan } = req.body;

    try {
      const data = await loadRegistrationData(req, maHocKy);
      const { student, semester, registrationDetails, activeCredits } = data;

      if (!student) {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Không tìm thấy hồ sơ sinh viên cho tài khoản này.",
        );
      }

      if (!semester || Number(maHocKy) <= 0 || Number(maHocPhan) <= 0) {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Vui lòng chọn học kỳ và lớp học phần hợp lệ.",
        );
      }

      if (semester.trang_thai !== "dang_mo") {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Học kỳ này chưa mở đăng ký hoặc đã kết thúc.",
        );
      }

      const window = await SemesterModel.getRegistrationWindow(
        semester.ma_hoc_ky_id,
        student.khoa,
      );
      const startsAt = window?.ngay_bat_dau || semester.ngay_bat_dau_dk;
      const endsAt = window?.ngay_ket_thuc || semester.ngay_ket_thuc_dk;
      if (!isTodayInRange(startsAt, endsAt)) {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Hiện không nằm trong thời gian đăng ký của khóa/học kỳ này.",
        );
      }

      const course = await StudentCourseModel.getById(maHocPhan);
      if (!course || Number(course.ma_hoc_ky) !== Number(maHocKy)) {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Lớp học phần không thuộc học kỳ đã chọn.",
        );
      }

      if (course.trang_thai !== "mo_dang_ky") {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Lớp học phần này hiện không mở đăng ký.",
        );
      }

      if (Number(course.so_sv_hien_tai) >= Number(course.so_sv_max)) {
        return renderRegistrationPage(
          res,
          400,
          data,
          "Lớp học phần đã đủ sĩ số.",
        );
      }

      let registration = data.registration;
      if (!registration) {
        const newRegistrationId = await RegistrationModel.create({
          maSinhVien: student.ma_sinh_vien_id,
          maHocKy,
          tongTinChi: 0,
        });
        registration = { ma_dang_ky: newRegistrationId };
      }

      const existingDetail =
        await RegistrationDetailModel.findByRegistrationAndCourse(
          registration.ma_dang_ky,
          maHocPhan,
        );
      if (existingDetail?.trang_thai === "da_dang_ky") {
        const refreshed = await loadRegistrationData(req, maHocKy);
        return renderRegistrationPage(
          res,
          400,
          refreshed,
          "Bạn đã đăng ký lớp học phần này rồi.",
        );
      }

      const hasSameSubject = await RegistrationDetailModel.hasActiveSubject(
        registration.ma_dang_ky,
        course.ma_mon_hoc,
        maHocPhan,
      );
      if (hasSameSubject) {
        const refreshed = await loadRegistrationData(req, maHocKy);
        return renderRegistrationPage(
          res,
          400,
          refreshed,
          "Bạn đã đăng ký một lớp khác của môn học này trong học kỳ.",
        );
      }

      const conflict = await RegistrationDetailModel.hasScheduleConflict(
        registration.ma_dang_ky,
        course,
      );
      if (conflict) {
        const refreshed = await loadRegistrationData(req, maHocKy);
        return renderRegistrationPage(
          res,
          400,
          refreshed,
          `Trùng lịch với ${conflict.ten_mon_hoc} (${conflict.ma_hoc_phan}).`,
        );
      }

      if (
        activeCredits + Number(course.so_tin_chi || 0) >
        MAX_CREDITS_PER_SEMESTER
      ) {
        const refreshed = await loadRegistrationData(req, maHocKy);
        return renderRegistrationPage(
          res,
          400,
          refreshed,
          `Vượt giới hạn ${MAX_CREDITS_PER_SEMESTER} tín chỉ/học kỳ.`,
        );
      }

      if (existingDetail?.trang_thai === "da_huy") {
        await RegistrationDetailModel.updateStatus(
          existingDetail.ma_chi_tiet,
          "da_dang_ky",
        );
      } else {
        await RegistrationDetailModel.create({
          maDangKy: registration.ma_dang_ky,
          maHocPhan,
        });
      }

      const refreshed = await loadRegistrationData(req, maHocKy);
      return renderRegistrationPage(
        res,
        200,
        refreshed,
        null,
        "Đăng ký học phần thành công.",
      );
    } catch (error) {
      console.error(error);
      const data = await loadRegistrationData(req, maHocKy).catch(() => null);
      if (data) {
        return renderRegistrationPage(
          res,
          500,
          data,
          "Đăng ký học phần thất bại. Vui lòng kiểm tra điều kiện và thử lại.",
        );
      }
      return res
        .status(500)
        .json({ success: false, message: "Đăng ký học phần thất bại." });
    }
  },

  async cancelRegistration(req, res) {
    try {
      const student = await StudentProfileModel.getByUserId(
        req.session.user.maNguoiDung,
      );
      if (!student) return res.redirect("/student/registrations");

      const detail = await RegistrationDetailModel.getOwnedById(
        req.params.maChiTiet,
        student.ma_sinh_vien_id,
      );
      if (!detail) return res.status(404).redirect("/student/registrations");

      await RegistrationDetailModel.updateStatus(
        req.params.maChiTiet,
        "da_huy",
      );
      return res.redirect(`/student/registrations?maHocKy=${detail.ma_hoc_ky}`);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Hủy đăng ký thất bại." });
    }
  },
};

module.exports = StudentController;
