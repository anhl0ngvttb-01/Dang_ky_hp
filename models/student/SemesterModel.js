const pool = require("../../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM hoc_ky ORDER BY ma_hoc_ky_id DESC",
    );
    return rows;
  },
};

