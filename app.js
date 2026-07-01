require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE) || 86400000,
      httpOnly: true,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || "Hệ thống đăng ký học phần";
  next();
});
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
