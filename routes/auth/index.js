const express = require("express");
const AuthController = require("../../controllers/auth/AuthController");
const auth = require("../../middlewares/auth/auth");

const router = express.Router();

router.get("/", (req, res) => res.redirect("/auth/login"));
router.get("/login", AuthController.renderLogin);
router.post("/login", AuthController.login);
router.get("/register", AuthController.renderRegister);
router.post("/register", AuthController.register);
router.get("/logout", auth, AuthController.logout);
router.get("/dashboard", auth, AuthController.dashboard);

module.exports = router;
