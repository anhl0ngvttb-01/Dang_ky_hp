const pool = require("../../config/db");

module.exports = {
  async createDefault({ maNguoiDung, maGiangVien, hoTen, email }) {
    const [result] = await pool.query(
      "INSERT INTO giang_vien (ma_nguoi_dung, ma_giang_vien, ho_ten, email, trang_thai) VALUES (?, ?, ?, ?, ?)",
      [maNguoiDung, maGiangVien, hoTen, email || null, "dang_day"],
    );
    return result.insertId;
  },
};
