const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_phan ORDER BY ma_hoc_phan_id DESC",
    );
    return rows;
  },

  async create(payload) {
    const [result] = await pool.query(
      "INSERT INTO hoc_phan (ma_hoc_phan, ma_mon_hoc, ma_giang_vien, ma_hoc_ky, thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, so_tin_chi, so_sv_max, so_sv_hien_tai, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        payload.maHocPhan,
        payload.maMonHoc,
        payload.maGiangVien,
        payload.maHocKy,
        payload.thu,
        payload.tietBatDau,
        payload.tietKetThuc,
        payload.phongHoc,
        payload.soTinChi,
        payload.soSvMax ?? 50,
        payload.soSvHienTai ?? 0,
        payload.trangThai ?? "mo_dang_ky",
      ],
    );
    return result.insertId;
  },

  async update(maHocPhanId, payload) {
    await pool.query(
      "UPDATE hoc_phan SET ma_hoc_phan = ?, ma_mon_hoc = ?, ma_giang_vien = ?, ma_hoc_ky = ?, thu = ?, tiet_bat_dau = ?, tiet_ket_thuc = ?, phong_hoc = ?, so_tin_chi = ?, so_sv_max = ?, so_sv_hien_tai = ?, trang_thai = ? WHERE ma_hoc_phan_id = ?",
      [
        payload.maHocPhan,
        payload.maMonHoc,
        payload.maGiangVien,
        payload.maHocKy,
        payload.thu,
        payload.tietBatDau,
        payload.tietKetThuc,
        payload.phongHoc,
        payload.soTinChi,
        payload.soSvMax ?? 50,
        payload.soSvHienTai ?? 0,
        payload.trangThai ?? "mo_dang_ky",
        maHocPhanId,
      ],
    );
    return true;
  },
};
