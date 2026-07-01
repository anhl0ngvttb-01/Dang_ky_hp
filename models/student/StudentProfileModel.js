const pool = require("../../config/db");

module.exports = {
  async getByUserId(maNguoiDung) {
    const [rows] = await pool.query(
      "SELECT * FROM sinh_vien WHERE ma_nguoi_dung = ?",
      [maNguoiDung],
    );
    return rows[0] || null;
  },

  async updateProfile(maSinhVienId, payload) {
    const {
      hoTen,
      gioiTinh,
      ngaySinh,
      soDienThoai,
      email,
      diaChi,
      lop,
      nganhHoc,
      khoa,
      trangThai,
    } = payload;
    await pool.query(
      "UPDATE sinh_vien SET ho_ten = ?, gioi_tinh = ?, ngay_sinh = ?, so_dien_thoai = ?, email = ?, dia_chi = ?, lop = ?, nganh_hoc = ?, khoa = ?, trang_thai = ? WHERE ma_sinh_vien_id = ?",
      [
        hoTen,
        gioiTinh ?? "Nam",
        ngaySinh ?? null,
        soDienThoai ?? null,
        email ?? null,
        diaChi ?? null,
        lop,
        nganhHoc,
        khoa,
        trangThai ?? "dang_hoc",
        maSinhVienId,
      ],
    );
    return true;
  },
};

