const pool = require("../../config/db");

module.exports = {
  async getOverview() {
    const [students] = await pool.query(
      "SELECT COUNT(*) AS total FROM sinh_vien",
    );
    const [teachers] = await pool.query(
      "SELECT COUNT(*) AS total FROM giang_vien",
    );
    const [courses] = await pool.query(
      "SELECT COUNT(*) AS total FROM hoc_phan",
    );
    const [subjects] = await pool.query(
      "SELECT COUNT(*) AS total FROM mon_hoc",
    );
    const [semesters] = await pool.query(
      "SELECT COUNT(*) AS total FROM hoc_ky",
    );

    return {
      students: students[0]?.total || 0,
      teachers: teachers[0]?.total || 0,
      courses: courses[0]?.total || 0,
      subjects: subjects[0]?.total || 0,
      semesters: semesters[0]?.total || 0,
    };
  },
};

