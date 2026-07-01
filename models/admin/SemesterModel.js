const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_ky ORDER BY ma_hoc_ky_id DESC",
    );
    return rows;
  },

  async create(payload) {
    const [result] = await pool.query(
      "INSERT INTO hoc_ky (ten_hoc_ky, ma_hoc_ky, ngay_bat_dau, ngay_ket_thuc, ngay_bat_dau_dk, ngay_ket_thuc_dk, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        payload.tenHocKy,
        payload.maHocKy,
        payload.ngayBatDau,
        payload.ngayKetThuc,
        payload.ngayBatDauDk,
        payload.ngayKetThucDk,
        payload.trangThai ?? "chua_mo",
      ],
    );
    return result.insertId;
  },

  async update(maHocKyId, payload) {
    await pool.query(
      "UPDATE hoc_ky SET ten_hoc_ky = ?, ma_hoc_ky = ?, ngay_bat_dau = ?, ngay_ket_thuc = ?, ngay_bat_dau_dk = ?, ngay_ket_thuc_dk = ?, trang_thai = ? WHERE ma_hoc_ky_id = ?",
      [
        payload.tenHocKy,
        payload.maHocKy,
        payload.ngayBatDau,
        payload.ngayKetThuc,
        payload.ngayBatDauDk,
        payload.ngayKetThucDk,
        payload.trangThai ?? "chua_mo",
        maHocKyId,
      ],
    );
    return true;
  },

  async deleteById(maHocKyId) {
    await pool.query("DELETE FROM hoc_ky WHERE ma_hoc_ky_id = ?", [maHocKyId]);
    return true;
  },
};
