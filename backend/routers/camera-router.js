const express = require("express");
const { Camera, User } = require("../config/sequelize");
const urlRegex = require("../config/url-regex");

const regex = new RegExp(urlRegex);

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

router.get("/unassigned", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);
    const userCameras = await user.getCameras();
    const allCameras = await Camera.findAll();
    const unassignedCameras = [];

    if (userCameras.length === 0) {
      res.status(200).json(allCameras);
    } else {
      for (let i = 0; i < allCameras.length; i++) {
        const camera = allCameras[i];
        let found = false;
        for (let j = 0; j < userCameras.length; j++) {
          if (camera.id === userCameras[j].id) {
            found = true;
            break;
          }
        }
        if (!found) {
          unassignedCameras.push(camera);
        }
      }
      res.status(200).json(unassignedCameras);
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/assigned", async (req, res) => {
  try {
    const camera = req.body;
    if (!camera) {
      res.status(406).json({ message: "missing body" });
    } else if (!camera.url && regex.test(camera.url)) {
      res.status(406).json({ message: "missing url" });
    } else if (!camera.name) {
      res.status(406).json({ message: "missing name" });
    } else {
      const newCamera = await Camera.create(camera);
      const user = await User.findByPk(req.user.cnp);
      await user.addCamera(newCamera, { through: { detect: camera.detect } });
      res.status(201).json({ message: "created and assigned" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/assigned", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.body.id);
    if (!camera) {
      res.status(406).json({ message: "wrong id" });
    } else {
      const user = await User.findByPk(req.user.cnp);
      await user.addCamera(camera);
      res.status(201).json({ message: "assigned" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/assigned/detect/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);
    const camera = await user.getCameras({ where: { id: req.params.id } });
    await camera[0].UserCamera.update({ detect: req.body.detect });

    res.status(201).json({ message: `detect: ${req.body.detect}` });
  } catch (e) {
    console.warn(e);
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
