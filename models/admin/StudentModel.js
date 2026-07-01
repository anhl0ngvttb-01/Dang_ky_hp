const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM sinh_vien ORDER BY ma_sinh_vien_id DESC",
    );
    return rows;
  },

  async getById(maSinhVienId) {
    const [rows] = await pool.query(
      "SELECT * FROM sinh_vien WHERE ma_sinh_vien_id = ?",
      [maSinhVienId],
    );
    return rows[0] || null;
  },

  async create(payload) {
    const [result] = await pool.query(
      "INSERT INTO sinh_vien (ma_nguoi_dung, ma_sinh_vien, ho_ten, gioi_tinh, ngay_sinh, so_dien_thoai, email, dia_chi, lop, nganh_hoc, khoa, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        payload.maNguoiDung ?? null,
        payload.maSinhVien,
        payload.hoTen,
        payload.gioiTinh ?? "Nam",
        payload.ngaySinh ?? null,
        payload.soDienThoai ?? null,
        payload.email ?? null,
        payload.diaChi ?? null,
        payload.lop,
        payload.nganhHoc,
        payload.khoa,
        payload.trangThai ?? "dang_hoc",
      ],
    );
    return result.insertId;
  },

  async update(maSinhVienId, payload) {
    await pool.query(
      "UPDATE sinh_vien SET ma_nguoi_dung = ?, ma_sinh_vien = ?, ho_ten = ?, gioi_tinh = ?, ngay_sinh = ?, so_dien_thoai = ?, email = ?, dia_chi = ?, lop = ?, nganh_hoc = ?, khoa = ?, trang_thai = ? WHERE ma_sinh_vien_id = ?",
      [
        payload.maNguoiDung ?? null,
        payload.maSinhVien,
        payload.hoTen,
        payload.gioiTinh ?? "Nam",
        payload.ngaySinh ?? null,
        payload.soDienThoai ?? null,
        payload.email ?? null,
        payload.diaChi ?? null,
        payload.lop,
        payload.nganhHoc,
        payload.khoa,
        payload.trangThai ?? "dang_hoc",
        maSinhVienId,
      ],
    );
    return true;
  },

  async deleteById(maSinhVienId) {
    await pool.query("DELETE FROM sinh_vien WHERE ma_sinh_vien_id = ?", [
      maSinhVienId,
    ]);
    return true;
  },
};

