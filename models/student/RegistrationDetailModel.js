const pool = require("../../config/db");

module.exports = {
  async getByRegistration(maDangKy) {
    const [rows] = await pool.query(
      `SELECT ctdk.*, hp.ma_hoc_phan, hp.phong_hoc, hp.thu, hp.tiet_bat_dau, hp.tiet_ket_thuc,
              mh.ten_mon_hoc, gv.ho_ten AS ten_giang_vien
       FROM chi_tiet_dang_ky ctdk
       JOIN hoc_phan hp ON hp.ma_hoc_phan_id = ctdk.ma_hoc_phan
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       WHERE ctdk.ma_dang_ky = ?
       ORDER BY ctdk.ma_chi_tiet DESC`,
      [maDangKy],
    );
    return rows;
  },

  async create({ maDangKy, maHocPhan, trangThai = "da_dang_ky" }) {
    const [result] = await pool.query(
      "INSERT INTO chi_tiet_dang_ky (ma_dang_ky, ma_hoc_phan, trang_thai) VALUES (?, ?, ?)",
      [maDangKy, maHocPhan, trangThai],
    );
    return result.insertId;
  },

  async updateStatus(maChiTiet, trangThai) {
    await pool.query(
      "UPDATE chi_tiet_dang_ky SET trang_thai = ? WHERE ma_chi_tiet = ?",
      [trangThai, maChiTiet],
    );
    return true;
  },

  async deleteById(maChiTiet) {
    await pool.query("DELETE FROM chi_tiet_dang_ky WHERE ma_chi_tiet = ?", [maChiTiet]);
    return true;
  },
};
