const bcrypt = require("bcrypt");
const UserModel = require("../../models/auth/UserModel");
const RoleModel = require("../../models/auth/RoleModel");
const TeacherAccountModel = require("../../models/auth/TeacherAccountModel");
const validators = require("../../helpers/validators");

function redirectByRole(roleName) {
  if (roleName === "admin") return "/admin/dashboard";
  if (roleName === "student") return "/student/profile";
  if (roleName === "teacher") return "/teacher/profile";
  return "/auth/dashboard";
}

async function renderRegisterWithRoles(res, status, error, form = {}) {
  const roles = (await RoleModel.getAll()).filter(
    (role) => role.ten_vai_tro !== "student",
  );
  return res.status(status).render("auth/register", {
    title: "Đăng ký tài khoản",
    roles,
    error,
    form,
  });
}

const AuthController = {
  async renderLogin(req, res) {
    return res.render("auth/login", {
      title: "Đăng nhập",
      error: null,
      form: {},
    });
  },

  async renderRegister(req, res) {
    if (!req.session.user || req.session.user.maVaiTro !== 1) {
      return res.render("auth/login", {
        title: "Đăng nhập",
        error:
          "Chỉ quản trị viên mới được tạo tài khoản. Vui lòng đăng nhập bằng tài khoản admin.",
        form: {},
      });
    }

    const roles = (await RoleModel.getAll()).filter(
      (role) => role.ten_vai_tro !== "student",
    );
    return res.render("auth/register", {
      title: "Đăng ký tài khoản",
      roles,
      error: null,
      form: {},
    });
  },

  async login(req, res) {
    try {
      const { tenDangNhap, matKhau } = req.body;

      if (
        !validators.isRequired(tenDangNhap) ||
        !validators.isRequired(matKhau)
      ) {
        return res.status(400).render("auth/login", {
          title: "Đăng nhập",
          error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.",
          form: req.body,
        });
      }

      const user = await UserModel.getByUsername(tenDangNhap.trim());
      if (!user) {
        return res.status(401).render("auth/login", {
          title: "Đăng nhập",
          error: "Tên đăng nhập hoặc mật khẩu không đúng.",
          form: req.body,
        });
      }

      if (user.trang_thai !== "hoat_dong") {
        return res.status(403).render("auth/login", {
          title: "Đăng nhập",
          error: "Tài khoản của bạn đã bị khóa.",
          form: req.body,
        });
      }

      const isMatch = await bcrypt.compare(matKhau, user.mat_khau);
      if (!isMatch) {
        return res.status(401).render("auth/login", {
          title: "Đăng nhập",
          error: "Tên đăng nhập hoặc mật khẩu không đúng.",
          form: req.body,
        });
      }

      const role = await RoleModel.getById(user.ma_vai_tro);
      req.session.user = {
        maNguoiDung: user.ma_nguoi_dung,
        tenDangNhap: user.ten_dang_nhap,
        email: user.email,
        maVaiTro: user.ma_vai_tro,
        roleName: role?.ten_vai_tro || "user",
      };

      return res.redirect(redirectByRole(req.session.user.roleName));
    } catch (error) {
      console.error(error);
      return res.status(500).render("auth/login", {
        title: "Đăng nhập",
        error: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
        form: req.body,
      });
    }
  },

  async register(req, res) {
    try {
      if (!req.session.user || req.session.user.maVaiTro !== 1) {
        return renderRegisterWithRoles(
          res,
          403,
          "Chỉ quản trị viên mới được tạo tài khoản.",
          req.body,
        );
      }

      const { tenDangNhap, email, matKhau, xacNhanMatKhau } = req.body;
      const username = String(tenDangNhap || "").trim();
      const userEmail = String(email || "").trim();
      const roleId = 3;

      if (
        !validators.isRequired(username) ||
        !validators.isRequired(userEmail) ||
        !validators.isRequired(matKhau) ||
        !validators.isRequired(xacNhanMatKhau)
      ) {
        return renderRegisterWithRoles(
          res,
          400,
          "Vui lòng nhập đầy đủ thông tin.",
          req.body,
        );
      }

      if (!validators.isUsername(username)) {
        return renderRegisterWithRoles(
          res,
          400,
          "Tên đăng nhập chỉ gồm chữ, số, dấu gạch dưới và dài 3-50 ký tự.",
          req.body,
        );
      }

      if (!validators.isEmail(userEmail)) {
        return renderRegisterWithRoles(
          res,
          400,
          "Email không đúng định dạng.",
          req.body,
        );
      }

      if (!validators.isStrongPassword(matKhau)) {
        return renderRegisterWithRoles(
          res,
          400,
          "Mật khẩu cần ít nhất 6 ký tự.",
          req.body,
        );
      }

      if (matKhau !== xacNhanMatKhau) {
        return renderRegisterWithRoles(
          res,
          400,
          "Xác nhận mật khẩu không khớp.",
          req.body,
        );
      }

      const role = await RoleModel.getById(roleId);
      if (!role) {
        return renderRegisterWithRoles(
          res,
          400,
          "Vai trò không hợp lệ.",
          req.body,
        );
      }

      if (role.ten_vai_tro === "student") {
        return renderRegisterWithRoles(
          res,
          400,
          "Tài khoản sinh viên chỉ được tạo bởi quản trị viên tại mục Quản lý sinh viên.",
          req.body,
        );
      }

      const existed = await UserModel.getByUsername(username);
      if (existed) {
        return renderRegisterWithRoles(
          res,
          400,
          "Tên đăng nhập đã tồn tại.",
          req.body,
        );
      }

      const hashedPassword = await bcrypt.hash(matKhau, 10);
      const userId = await UserModel.create({
        tenDangNhap: username,
        matKhau: hashedPassword,
        email: userEmail,
        maVaiTro: roleId,
      });

      if (role.ten_vai_tro === "student") {
        await StudentAccountModel.createDefault({
          maNguoiDung: userId,
          maSinhVien: `SV${String(userId).padStart(3, "0")}`,
          hoTen: username,
          email: userEmail,
        });
      }

      if (role.ten_vai_tro === "teacher") {
        await TeacherAccountModel.createDefault({
          maNguoiDung: userId,
          maGiangVien: `GV${String(userId).padStart(3, "0")}`,
          hoTen: username,
          email: userEmail,
        });
      }

      return res.redirect(
        role.ten_vai_tro === "student" ? "/admin/students" : "/admin/dashboard",
      );
    } catch (error) {
      console.error(error);
      return renderRegisterWithRoles(
        res,
        500,
        "Đăng ký thất bại. Vui lòng kiểm tra dữ liệu và thử lại.",
        req.body,
      );
    }
  },

  async dashboard(req, res) {
    return res.render("auth/dashboard", {
      title: "Tài khoản của tôi",
      user: req.session.user,
    });
  },

  async logout(req, res) {
    req.session.destroy(() => res.redirect("/auth/login"));
  },
};

module.exports = AuthController;
