const express = require("express");
const { User } = require("../config/sequelize");
const urlRegex = require("../config/url-regex");

const regex = new RegExp(urlRegex);

const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     console.warn(error);
//     res.status(500).json({ message: "server error" });
//   }
// });

router.get("/get_own", async (req, res) => {
  try {
    res.json({
      name: req.user.name,
      email: req.user.email,
      location: req.user.location,
      cnp: req.user.cnp,
    });
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/put_own", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);
    if (user) {
      await user.update(req.body);
      res.status(202).json({ message: "accepted" });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === "on") {
      await User.bulkCreate(req.body);
      res.status(201).json({ message: "created" });
    } else {
      await User.create(req.body);
      res.status(201).json({ message: "created" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:cnp", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.cnp);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/:cnp", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.cnp);
    if (user) {
      await user.update(req.body);
      res.status(202).json({ message: "accepted" });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

// remake to delete from user-camera table
// router.delete("/:cnp", async (req, res) => {
//   try {
//     const camera = await Camera.findByPk(req.params.cnp);
//     if (camera) {
//       await camera.destroy();
//       res.status(202).json({ message: "accepted" });
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (error) {
//     console.warn(error);
//     res.status(500).json({ message: "server error" });
//   }
// });

module.exports = router;
