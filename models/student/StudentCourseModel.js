const pool = require("../../config/db");

module.exports = {
  async getOpenBySemester(maHocKy) {
    const [rows] = await pool.query(
      `SELECT hp.*, mh.ten_mon_hoc, gv.ho_ten AS ten_giang_vien
       FROM hoc_phan hp
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       WHERE hp.ma_hoc_ky = ? AND hp.trang_thai = 'mo_dang_ky'
       ORDER BY mh.ten_mon_hoc, hp.ma_hoc_phan`,
      [maHocKy],
    );
    return rows;
  },
};
