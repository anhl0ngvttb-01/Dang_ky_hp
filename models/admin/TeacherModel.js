const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM giang_vien ORDER BY ma_giang_vien_id DESC",
    );
    return rows;
  },

  async create(payload) {
    const [result] = await pool.query(
      "INSERT INTO giang_vien (ma_nguoi_dung, ma_giang_vien, ho_ten, email, so_dien_thoai, bo_mon, hoc_ham, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        payload.maNguoiDung ?? null,
        payload.maGiangVien,
        payload.hoTen,
        payload.email ?? null,
        payload.soDienThoai ?? null,
        payload.boMon ?? null,
        payload.hocHam ?? null,
        payload.trangThai ?? "dang_day",
      ],
    );
    return result.insertId;
  },

  async update(maGiangVienId, payload) {
    await pool.query(
      "UPDATE giang_vien SET ma_nguoi_dung = ?, ma_giang_vien = ?, ho_ten = ?, email = ?, so_dien_thoai = ?, bo_mon = ?, hoc_ham = ?, trang_thai = ? WHERE ma_giang_vien_id = ?",
      [
        payload.maNguoiDung ?? null,
        payload.maGiangVien,
        payload.hoTen,
        payload.email ?? null,
        payload.soDienThoai ?? null,
        payload.boMon ?? null,
        payload.hocHam ?? null,
        payload.trangThai ?? "dang_day",
        maGiangVienId,
      ],
    );
    return true;
  },

  async deleteById(maGiangVienId) {
    await pool.query("DELETE FROM giang_vien WHERE ma_giang_vien_id = ?", [
      maGiangVienId,
    ]);
    return true;
  },
};

