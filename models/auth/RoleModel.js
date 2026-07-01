const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM vai_tro ORDER BY ma_vai_tro",
    );
    return rows;
  },

  async getById(maVaiTro) {
    const [rows] = await pool.query(
      "SELECT * FROM vai_tro WHERE ma_vai_tro = ?",
      [maVaiTro],
    );
    return rows[0] || null;
  },
};

