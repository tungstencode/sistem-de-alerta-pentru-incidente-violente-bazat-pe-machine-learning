const express = require("express");
const { User } = require("../config/sequelize");
const passport = require("../config/passport");
const isAuthenticated = require("../config/auth");

const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.body.remember) {
    res.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  } else {
    res.cookie.expires = false;
    req.session.cookie.expires = false;
  }
  res.status(202).json({ message: "ok" });
});

router.post("/signup", async (req, res) => {
  try {
    if (!req.body.cnp) {
      res.status(406).json({ message: "missing cnp" });
    } else if (!req.body.email) {
      res.status(406).json({ message: "missing email" });
    } else if (!req.body.password) {
      res.status(406).json({ message: "missing password" });
    } else if (!req.body.name) {
      res.status(406).json({ message: "missing name" });
    } else {
      await User.create(req.body)
        .then(() => {
          res.status(201).json({ message: "user created" });
        })
        .catch((err) => {
          res.status(409).json({ message: err }); // just for debugging
          console.error(err);
        });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});
// Route for logging user out
router.get("/logout", (req, res) => {
  res.cookie.expires = false;
  req.session.cookie.expires = false;
  res.clearCookie("key");
  req.logout();
  res.redirect("/");
});
// Route for getting some data about our user to be used client side
router.get("/user_data", isAuthenticated, (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    res.json({
      name: req.user.name,
      email: req.user.email,
      location: req.user.location,
      cnp: req.user.cnp,
    });
  }
});

module.exports = router;
