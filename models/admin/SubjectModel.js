const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM mon_hoc ORDER BY ma_mon_hoc_id DESC",
    );
    return rows;
  },

  async getById(maMonHocId) {
    const [rows] = await pool.query(
      "SELECT * FROM mon_hoc WHERE ma_mon_hoc_id = ?",
      [maMonHocId],
    );
    return rows[0] || null;
  },

  async create(payload) {
    const [result] = await pool.query(
      "INSERT INTO mon_hoc (ma_mon_hoc, ten_mon_hoc, so_tin_chi, mo_ta, bat_buoc) VALUES (?, ?, ?, ?, ?)",
      [
        payload.maMonHoc,
        payload.tenMonHoc,
        payload.soTinChi,
        payload.moTa || null,
        payload.batBuoc ?? true,
      ],
    );
    return result.insertId;
  },

  async update(maMonHocId, payload) {
    await pool.query(
      "UPDATE mon_hoc SET ma_mon_hoc = ?, ten_mon_hoc = ?, so_tin_chi = ?, mo_ta = ?, bat_buoc = ? WHERE ma_mon_hoc_id = ?",
      [
        payload.maMonHoc,
        payload.tenMonHoc,
        payload.soTinChi,
        payload.moTa ?? null,
        payload.batBuoc ?? true,
        maMonHocId,
      ],
    );
    return true;
  },

  async deleteById(maMonHocId) {
    await pool.query("DELETE FROM mon_hoc WHERE ma_mon_hoc_id = ?", [
      maMonHocId,
    ]);
    return true;
  },
};

