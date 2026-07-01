const pool = require("../../config/db");

module.exports = {
  async getCurrentByStudentAndSemester(maSinhVienId, maHocKy) {
    const [rows] = await pool.query(
      "SELECT * FROM dang_ky WHERE ma_sinh_vien = ? AND ma_hoc_ky = ?",
      [maSinhVienId, maHocKy],
    );
    return rows[0] || null;
  },

  async create({
    maSinhVien,
    maHocKy,
    tongTinChi = 0,
    trangThai = "da_duyet",
    ghiChu = null,
  }) {
    const [result] = await pool.query(
      "INSERT INTO dang_ky (ma_sinh_vien, ma_hoc_ky, tong_tin_chi, trang_thai, ghi_chu) VALUES (?, ?, ?, ?, ?)",
      [maSinhVien, maHocKy, tongTinChi, trangThai, ghiChu],
    );
    return result.insertId;
  },

  async update(maDangKy, payload) {
    const { tongTinChi, trangThai, ghiChu } = payload;
    await pool.query(
      "UPDATE dang_ky SET tong_tin_chi = ?, trang_thai = ?, ghi_chu = ? WHERE ma_dang_ky = ?",
      [tongTinChi ?? 0, trangThai ?? "da_duyet", ghiChu ?? null, maDangKy],
    );
    return true;
  },
};

