const bcrypt = require("bcrypt");
const StudentModel = require("../../models/admin/StudentModel");
const TeacherModel = require("../../models/admin/TeacherModel");
const DashboardModel = require("../../models/admin/DashboardModel");
const UserModel = require("../../models/auth/UserModel");
const validators = require("../../helpers/validators");

const AdminController = {
  async dashboard(req, res) {
    try {
      const overview = await DashboardModel.getOverview();
      return res.render("admin/dashboard", {
        title: "Bảng điều khiển",
        overview,
        error: null,
      });
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
      return res.render("admin/students", {
        title: "Quản lý sinh viên",
        students,
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("admin/students", {
        title: "Quản lý sinh viên",
        students: [],
        error: "Không thể tải danh sách sinh viên.",
      });
    }
  },

  async createStudent(req, res) {
    try {
      const {
        tenDangNhap,
        email,
        hoTen,
        maSinhVien,
        gioiTinh,
        ngaySinh,
        soDienThoai,
        diaChi,
        lop,
        nganhHoc,
        khoa,
      } = req.body;

      const username = String(tenDangNhap || "").trim();
      const userEmail = String(email || "").trim();
      const studentCode = String(maSinhVien || "").trim();
      const studentName = String(hoTen || "").trim();
      const studentClass = String(lop || "").trim();
      const major = String(nganhHoc || "").trim();
      const faculty = String(khoa || "").trim();
      const defaultPassword = "123456";

      if (
        !validators.isRequired(username) ||
        !validators.isRequired(userEmail) ||
        !validators.isRequired(studentCode) ||
        !validators.isRequired(studentName) ||
        !validators.isRequired(studentClass) ||
        !validators.isRequired(major) ||
        !validators.isRequired(faculty)
      ) {
        const students = await StudentModel.getAll();
        return res.status(400).render("admin/students", {
          title: "Quản lý sinh viên",
          students,
          error:
            "Vui lòng nhập đầy đủ thông tin bắt buộc: tên đăng nhập, email, mã sinh viên, họ tên, lớp, ngành học và khóa.",
        });
      }

      if (!validators.isUsername(username)) {
        const students = await StudentModel.getAll();
        return res.status(400).render("admin/students", {
          title: "Quản lý sinh viên",
          students,
          error:
            "Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới, dài 3-50 ký tự.",
        });
      }

      if (!validators.isEmail(userEmail)) {
        const students = await StudentModel.getAll();
        return res.status(400).render("admin/students", {
          title: "Quản lý sinh viên",
          students,
          error: "Email không đúng định dạng.",
        });
      }

      const existedUser = await UserModel.getByUsername(username);
      if (existedUser) {
        const students = await StudentModel.getAll();
        return res.status(400).render("admin/students", {
          title: "Quản lý sinh viên",
          students,
          error: "Tên đăng nhập này đã tồn tại.",
        });
      }

      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const userId = await UserModel.create({
        tenDangNhap: username,
        matKhau: hashedPassword,
        email: userEmail,
        maVaiTro: 2,
      });

      await StudentModel.create({
        maNguoiDung: userId,
        maSinhVien: studentCode,
        hoTen: studentName,
        gioiTinh: gioiTinh || "Nam",
        ngaySinh: ngaySinh || null,
        soDienThoai: soDienThoai || null,
        email: userEmail,
        diaChi: diaChi || null,
        lop: studentClass,
        nganhHoc: major,
        khoa: faculty,
        trangThai: "dang_hoc",
      });

      return res.redirect("/admin/students");
    } catch (error) {
      console.error(error);
      const students = await StudentModel.getAll();
      return res.status(500).render("admin/students", {
        title: "Quản lý sinh viên",
        students,
        error: "Tạo tài khoản sinh viên thất bại. Vui lòng thử lại.",
      });
    }
  },

  async listTeachers(req, res) {
    try {
      const teachers = await TeacherModel.getAll();
      return res.render("admin/teachers", {
        title: "Quản lý giảng viên",
        teachers,
        error: null,
      });
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
