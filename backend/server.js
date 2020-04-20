const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const https = require("https");
const fs = require("fs");
const { sequelize } = require("./config/sequelize");
const isAuthenticated = require("./config/auth");

const app = express();

const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

/** MIDDLEWARE */
app.enable("trust proxy");
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.set("etag", false);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

/** ROUTES */
const loginRouter = require("./routers/login-router");
const cameraRouter = require("./routers/camera-router");
const userRouter = require("./routers/user-router");
const logRouter = require("./routers/log-router");

app.use("/", loginRouter);
app.use(isAuthenticated);
app.use("/cameras", cameraRouter);
app.use("/users", userRouter);
app.use("/logs", logRouter);

app.get("/create", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: "created" });
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

const options = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
  passphrase: process.env.SESSION_SECRET || "secret",
};

https.createServer(options, app).listen(port, () => {
  console.log(`Express HTTPS server listening on port ${port}`);
});
