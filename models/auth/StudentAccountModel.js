const pool = require("../../config/db");

module.exports = {
  async createDefault({ maNguoiDung, maSinhVien, hoTen, email }) {
    const [result] = await pool.query(
      "INSERT INTO sinh_vien (ma_nguoi_dung, ma_sinh_vien, ho_ten, email, lop, nganh_hoc, khoa, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        maNguoiDung,
        maSinhVien,
        hoTen,
        email || null,
        "Chưa cập nhật",
        "Chưa cập nhật",
        "Chưa cập nhật",
        "dang_hoc",
      ],
    );
    return result.insertId;
  },
};
