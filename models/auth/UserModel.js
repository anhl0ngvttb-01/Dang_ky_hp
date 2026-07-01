const pool = require("../../config/db");

module.exports = {
  async getByUsername(tenDangNhap) {
    const [rows] = await pool.query(
      "SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ?",
      [tenDangNhap],
    );
    return rows[0] || null;
  },

  async create({ tenDangNhap, matKhau, email, maVaiTro }) {
    const [result] = await pool.query(
      "INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, email, ma_vai_tro, trang_thai) VALUES (?, ?, ?, ?, ?)",
      [tenDangNhap, matKhau, email || null, maVaiTro, "hoat_dong"],
    );
    return result.insertId;
  },
};

