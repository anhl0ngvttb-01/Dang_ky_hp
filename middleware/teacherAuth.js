module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }

  if (req.session.user.maVaiTro === 3) {
    return next();
  }

  return res.status(403).send("Bạn không có quyền truy cập module giảng viên.");
};
