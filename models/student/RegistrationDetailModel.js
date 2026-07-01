const pool = require("../../config/db");

module.exports = {
  async getByRegistration(maDangKy) {
    const [rows] = await pool.query(
      `SELECT ctdk.*, hp.ma_hoc_phan, hp.phong_hoc, hp.thu, hp.tiet_bat_dau, hp.tiet_ket_thuc,
              hp.so_tin_chi, hp.so_sv_hien_tai, hp.so_sv_max,
              mh.ma_mon_hoc, mh.ten_mon_hoc, gv.ho_ten AS ten_giang_vien
       FROM chi_tiet_dang_ky ctdk
       JOIN hoc_phan hp ON hp.ma_hoc_phan_id = ctdk.ma_hoc_phan
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       WHERE ctdk.ma_dang_ky = ?
       ORDER BY ctdk.trang_thai, ctdk.ma_chi_tiet DESC`,
      [maDangKy],
    );
    return rows;
  },

  async findByRegistrationAndCourse(maDangKy, maHocPhan) {
    const [rows] = await pool.query(
      "SELECT * FROM chi_tiet_dang_ky WHERE ma_dang_ky = ? AND ma_hoc_phan = ?",
      [maDangKy, maHocPhan],
    );
    return rows[0] || null;
  },

  async hasActiveSubject(maDangKy, maMonHoc, excludeMaHocPhan = null) {
    const [rows] = await pool.query(
      `SELECT ctdk.ma_chi_tiet
       FROM chi_tiet_dang_ky ctdk
       JOIN hoc_phan hp ON hp.ma_hoc_phan_id = ctdk.ma_hoc_phan
       WHERE ctdk.ma_dang_ky = ?
         AND hp.ma_mon_hoc = ?
         AND ctdk.trang_thai = 'da_dang_ky'
         AND (? IS NULL OR ctdk.ma_hoc_phan <> ?)
       LIMIT 1`,
      [maDangKy, maMonHoc, excludeMaHocPhan, excludeMaHocPhan],
    );
    return Boolean(rows.length);
  },

  async hasScheduleConflict(maDangKy, course) {
    const [rows] = await pool.query(
      `SELECT hp.ma_hoc_phan, mh.ten_mon_hoc, hp.thu, hp.tiet_bat_dau, hp.tiet_ket_thuc
       FROM chi_tiet_dang_ky ctdk
       JOIN hoc_phan hp ON hp.ma_hoc_phan_id = ctdk.ma_hoc_phan
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       WHERE ctdk.ma_dang_ky = ?
         AND ctdk.trang_thai = 'da_dang_ky'
         AND hp.thu = ?
         AND hp.tiet_bat_dau <= ?
         AND hp.tiet_ket_thuc >= ?
       LIMIT 1`,
      [maDangKy, course.thu, course.tiet_ket_thuc, course.tiet_bat_dau],
    );
    return rows[0] || null;
  },


  async getOwnedById(maChiTiet, maSinhVienId) {
    const [rows] = await pool.query(
      `SELECT ctdk.*, dk.ma_sinh_vien, dk.ma_hoc_ky
       FROM chi_tiet_dang_ky ctdk
       JOIN dang_ky dk ON dk.ma_dang_ky = ctdk.ma_dang_ky
       WHERE ctdk.ma_chi_tiet = ? AND dk.ma_sinh_vien = ?`,
      [maChiTiet, maSinhVienId],
    );
    return rows[0] || null;
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
