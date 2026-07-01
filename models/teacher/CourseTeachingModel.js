const pool = require("../../config/db");

module.exports = {
  async getByTeacher(maGiangVienId) {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_phan WHERE ma_giang_vien = ? ORDER BY ma_hoc_phan_id DESC",
      [maGiangVienId],
    );
    return rows;
  },

  async updateStatus(maHocPhanId, trangThai) {
    await pool.query(
      "UPDATE hoc_phan SET trang_thai = ? WHERE ma_hoc_phan_id = ?",
      [trangThai, maHocPhanId],
    );
    return true;
  },
};

