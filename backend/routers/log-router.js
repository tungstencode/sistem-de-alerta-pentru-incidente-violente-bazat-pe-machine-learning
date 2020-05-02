const express = require("express");
const moment = require("moment");
const { Log, User, Camera } = require("../config/sequelize");

const router = express.Router();

router.get("/graph/:year", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);

    const camerasWithLogs = await user.getCameras({
      include: [{ model: Log }],
      raw: false,
    });

    const logsBuild = [];

    moment.months().map((month) => {
      const builtLog = {};
      builtLog.dateTime = month;
      logsBuild.push(builtLog);
    });

    camerasWithLogs.map((cameraWithLogs) => {
      logsBuild.map((monthLogs) => {
        monthLogs[cameraWithLogs.name] = 0;
      });
    });

    camerasWithLogs.map((cameraWithLogs) => {
      for (let i = 0; i < cameraWithLogs.Logs.length; i++) {
        const year = moment(
          parseInt(cameraWithLogs.Logs[i].dateTime, 10),
        ).year();

        if (year.toString() === req.params.year.toString()) {
          const month = moment.months(
            moment(parseInt(cameraWithLogs.Logs[i].dateTime, 10)).month(),
          );
          logsBuild.map((monthLogs) => {
            if (monthLogs.dateTime === month) {
              monthLogs[cameraWithLogs.name] += 1;
            }
          });
        }
      }
    });

    res.status(200).json(logsBuild);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/camera/:year/:cameraId", async (req, res) => {
  try {
    const cameraWithLogs = await Camera.findOne({
      include: [{ model: Log }],
      raw: false,
      where: {
        id: req.params.cameraId,
      },
    });

    const logsBuild = [];

    moment.months().map((month) => {
      const builtLog = {};
      builtLog.dateTime = month;
      logsBuild.push(builtLog);
    });

    logsBuild.map((monthLogs) => {
      monthLogs[cameraWithLogs.name] = 0;
    });

    for (let i = 0; i < cameraWithLogs.Logs.length; i++) {
      const year = moment(parseInt(cameraWithLogs.Logs[i].dateTime, 10)).year();

      if (year.toString() === req.params.year.toString()) {
        const month = moment.months(
          moment(parseInt(cameraWithLogs.Logs[i].dateTime, 10)).month(),
        );
        logsBuild.map((monthLogs) => {
          if (monthLogs.dateTime === month) {
            monthLogs[cameraWithLogs.name] += 1;
          }
        });
      }
    }

    res.status(200).json(logsBuild);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/graph/:year/:month", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.cnp);
    const { year, month } = req.params;

    const camerasWithLogs = await user.getCameras({
      include: [{ model: Log }],
      raw: false,
    });

    const logsBuild = [];

    const daysInMonth = moment([year, month]).daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const current = moment([year, month])
        .date(i + 1)
        .format("YYYY-MM-DD");
      const builtLog = {};
      builtLog.dateTime = current;
      logsBuild.push(builtLog);
    }

    camerasWithLogs.map((cameraWithLogs) => {
      logsBuild.map((dayLogs) => {
        dayLogs[cameraWithLogs.name] = 0;
      });
    });

    camerasWithLogs.map((cameraWithLogs) => {
      for (let i = 0; i < cameraWithLogs.Logs.length; i++) {
        const dayToFind = moment(
          parseInt(cameraWithLogs.Logs[i].dateTime, 10),
        ).format("YYYY-MM-DD");

        logsBuild.map((dayLogs) => {
          if (dayLogs.dateTime === dayToFind) {
            dayLogs[cameraWithLogs.name] += 1;
          }
        });
      }
    });

    res.status(200).json(logsBuild);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/camera/:year/:month/:cameraId", async (req, res) => {
  try {
    const { year, month } = req.params;

    const cameraWithLogs = await Camera.findOne({
      include: [{ model: Log }],
      raw: false,
      where: {
        id: req.params.cameraId,
      },
    });

    const logsBuild = [];

    const daysInMonth = moment([year, month]).daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const current = moment([year, month])
        .date(i + 1)
        .format("YYYY-MM-DD");
      const builtLog = {};
      builtLog.dateTime = current;
      logsBuild.push(builtLog);
    }

    logsBuild.map((dayLogs) => {
      dayLogs[cameraWithLogs.name] = 0;
    });

    for (let i = 0; i < cameraWithLogs.Logs.length; i++) {
      const dayToFind = moment(
        parseInt(cameraWithLogs.Logs[i].dateTime, 10),
      ).format("YYYY-MM-DD");

      logsBuild.map((dayLogs) => {
        if (dayLogs.dateTime === dayToFind) {
          dayLogs[cameraWithLogs.name] += 1;
        }
      });
    }

    res.status(200).json(logsBuild);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const log = await Log.findByPk(req.params.id);
    await log.update(req.body);
    res.status(201).json({ message: "accepted" });
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/:cameraId", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.cameraId);

    const log = await Log.create({
      dateTime: moment.now().toString(),
    });
    await camera.addLog(log);

    res.status(201).json({ message: "created" });
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/camera/:cameraId", async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.cameraId);

    const logs = await camera.getLogs();

    res.status(201).json(logs);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/limit", async (req, res) => {
  try {
    const logs = [];
    const user = await User.findByPk(req.user.cnp);

    const cameras = await user.getCameras();

    for (let i = 0; i < cameras.length; i++) {
      const logsC = await cameras[i].getLogs();
      for (let j = 0; j < logsC.length; j++) {
        logs.push(logsC[j]);
      }
    }

    res.status(201).json(logs);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/limit/:limit", async (req, res) => {
  try {
    const logs = [];
    const { limit } = req.params;

    const user = await User.findByPk(req.user.cnp);

    const cameras = await user.getCameras();

    for (let i = 0; i < cameras.length; i++) {
      const logsC = await cameras[i].getLogs();
      for (let j = 0; j < logsC.length; j++) {
        if (logs.length <= limit - 1) {
          logs.push(logsC[j]);
        } else {
          break;
        }
      }
    }
    res.status(201).json(logs);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     if (req.query.bulk && req.query.bulk === "on") {
//       await Camera.bulkCreate(req.body);
//       res.status(201).json({ message: "created" });
//     } else {
//       await Camera.create(req.body);
//       res.status(201).json({ message: "created" });
//     }
//   } catch (e) {
//     console.warn(e);
//     res.status(500).json({ message: "server error" });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const camera = await Camera.findByPk(req.params.id);
//     if (camera) {
//       res.status(200).json(camera);
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (error) {
//     console.warn(error);
//     res.status(500).json({ message: "server error" });
//   }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     const camera = await Camera.findByPk(req.params.id);
//     if (camera) {
//       await camera.update(req.body);
//       res.status(202).json({ message: "accepted" });
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (error) {
//     console.warn(error);
//     res.status(500).json({ message: "server error" });
//   }
// });

// // remake to delete from user-camera table
// router.delete("/:id", async (req, res) => {
//   try {
//     const camera = await Camera.findByPk(req.params.id);
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
