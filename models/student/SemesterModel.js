const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_ky ORDER BY ma_hoc_ky_id DESC",
    );
    return rows;
  },

  async getById(maHocKy) {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_ky WHERE ma_hoc_ky_id = ?",
      [maHocKy],
    );
    return rows[0] || null;
  },

  async getRegistrationWindow(maHocKy, khoa) {
    const [rows] = await pool.query(
      `SELECT ngay_bat_dau, ngay_ket_thuc
       FROM dot_dang_ky
       WHERE ma_hoc_ky = ? AND (khoa = ? OR khoa IS NULL)
       ORDER BY CASE WHEN khoa = ? THEN 0 ELSE 1 END, khoa IS NULL ASC
       LIMIT 1`,
      [maHocKy, khoa, khoa],
    );
    return rows[0] || null;
  },
};
