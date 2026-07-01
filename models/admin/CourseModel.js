const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT hp.*, mh.ma_mon_hoc AS ma_mon_hoc_code, mh.ten_mon_hoc,
              gv.ma_giang_vien AS ma_giang_vien_code, gv.ho_ten AS ten_giang_vien,
              hk.ma_hoc_ky AS ma_hoc_ky_code, hk.ten_hoc_ky
       FROM hoc_phan hp
       JOIN mon_hoc mh ON mh.ma_mon_hoc_id = hp.ma_mon_hoc
       JOIN giang_vien gv ON gv.ma_giang_vien_id = hp.ma_giang_vien
       JOIN hoc_ky hk ON hk.ma_hoc_ky_id = hp.ma_hoc_ky
       ORDER BY hp.ma_hoc_phan_id DESC`,
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