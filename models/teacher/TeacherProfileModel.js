const pool = require("../../config/db");

module.exports = {
  async getByUserId(maNguoiDung) {
    const [rows] = await pool.query(
      "SELECT * FROM giang_vien WHERE ma_nguoi_dung = ?",
      [maNguoiDung],
    );
    return rows[0] || null;
  },

  async updateProfile(maGiangVienId, payload) {
    const { email, soDienThoai, boMon, hocHam, trangThai } = payload;
    await pool.query(
      "UPDATE giang_vien SET email = ?, so_dien_thoai = ?, bo_mon = ?, hoc_ham = ?, trang_thai = ? WHERE ma_giang_vien_id = ?",
      [
        email ?? null,
        soDienThoai ?? null,
        boMon ?? null,
        hocHam ?? null,
        trangThai ?? "dang_day",
        maGiangVienId,
      ],
    );
    return true;
  },
};

