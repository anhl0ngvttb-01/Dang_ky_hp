const pool = require("../../config/db");

module.exports = {
  async getOpenBySemester(maHocKy) {
    const [rows] = await pool.query(
      `SELECT hp.*, mh.ten_mon_hoc, mh.ma_mon_hoc AS ma_mon_hoc_code, gv.ho_ten AS ten_giang_vien
       FROM hoc_phan hp
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       WHERE hp.ma_hoc_ky = ? AND hp.trang_thai = 'mo_dang_ky'
       ORDER BY mh.ten_mon_hoc, hp.ma_hoc_phan`,
      [maHocKy],
    );
    return rows;
  },

  async getById(maHocPhan) {
    const [rows] = await pool.query(
      `SELECT hp.*, mh.ten_mon_hoc, mh.ma_mon_hoc AS ma_mon_hoc_code, gv.ho_ten AS ten_giang_vien,
              hk.trang_thai AS trang_thai_hoc_ky, hk.ngay_bat_dau_dk, hk.ngay_ket_thuc_dk
       FROM hoc_phan hp
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       JOIN hoc_ky hk ON hk.ma_hoc_ky_id = hp.ma_hoc_ky
       WHERE hp.ma_hoc_phan_id = ?`,
      [maHocPhan],
    );
    return rows[0] || null;
  },
};
