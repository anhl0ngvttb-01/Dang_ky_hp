const pool = require("../../config/db");

module.exports = {
  async getByTeacher(maGiangVienId) {
    const [rows] = await pool.query(
      `SELECT hp.*, mh.ma_mon_hoc, mh.ten_mon_hoc, hk.ten_hoc_ky
       FROM hoc_phan hp
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN hoc_ky hk ON hk.ma_hoc_ky_id = hp.ma_hoc_ky
       WHERE hp.ma_giang_vien = ?
       ORDER BY hp.ma_hoc_phan_id DESC`,
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