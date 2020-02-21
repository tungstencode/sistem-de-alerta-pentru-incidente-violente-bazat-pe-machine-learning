const express = require("express");
const Sequelize = require("sequelize");
const { Camera, User } = require("../config/sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cameras = await Camera.findAll();
    res.status(200).json(cameras);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/assigned", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);

    const cameras = await user.getCameras();

    res.status(200).json(cameras);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === "on") {
      await Camera.bulkCreate(req.body);
      res.status(201).json({ message: "created" });
    } else {
      await Camera.create(req.body);
      res.status(201).json({ message: "created" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (camera) {
      res.status(200).json(camera);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (camera) {
      await camera.update(req.body);
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
router.delete("/:id", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (camera) {
      await camera.destroy();
      res.status(202).json({ message: "accepted" });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;