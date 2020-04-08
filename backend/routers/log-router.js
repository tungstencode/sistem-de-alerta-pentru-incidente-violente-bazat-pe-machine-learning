const express = require("express");
const moment = require("moment");
const { Log, User } = require("../config/sequelize");

const router = express.Router();

router.get("/:year", async (req, res) => {
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
        const year = moment(parseInt(cameraWithLogs.Logs[i].dateTime)).year();

        if (year.toString() === req.params.year.toString()) {
          const month = moment.months(
            moment(parseInt(cameraWithLogs.Logs[i].dateTime)).month(),
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

router.get("/:year/:month", async (req, res) => {
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
          parseInt(cameraWithLogs.Logs[i].dateTime),
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

// router.get("/", async (req, res) => {
//   try {

//     const user = await User.findByPk(req.user.cnp);

//     const camerasWithLogs = await user.getCameras({
//       include: [{ model: Log }],
//       raw: false,
//     });

//     const data = [
//       {
//         dateTime: "2020-04-10",
//         camera1: 12,
//         camera2: 12,
//         camera3: 44,
//       },
//       {
//         dateTime: "2020-04-30",
//         camera1: 24,
//         camera2: 12,
//         camera3: 44,
//       },
//       {
//         dateTime: "2020-04-21",
//         camera1: 15,
//         camera2: 12,
//         camera3: 44,
//       },
//     ];

//     const logsBuild = [];

//     const findLog = (date, logs) => {
//       for (let i = 0; i < logs.length; i++) {
//         const log = logs[i];
//         if (log.dateTime === date) {
//           // console.log(log.dateTime, date);
//           return i;
//         }
//       }
//       return false;
//     };

//     camerasWithLogs.map((cameraWithLogs) => {
//       for (let i = 0; i < cameraWithLogs.Logs.length; i++) {
//         let builtLog = {};
//         const dateToFind = moment(cameraWithLogs.Logs[i].dateTime, "x").format(
//           "YYYY-MM-DD",
//         );
//         const logIndex = findLog(dateToFind, logsBuild);

//         if (logIndex === false) {
//           builtLog = {};
//           builtLog.dateTime = dateToFind;
//           builtLog[cameraWithLogs.name] = 1;
//           logsBuild.push(builtLog);
//         } else {
//           builtLog = logsBuild[logIndex];
//           if (builtLog[cameraWithLogs.name]) {
//             builtLog[cameraWithLogs.name] += 1;
//           } else {
//             builtLog[cameraWithLogs.name] = 1;
//           }
//         }
//       }
//       if (cameraWithLogs.Logs.length === 0) {
//         for (let i = 0; i < logsBuild.length; i++) {
//           const builtLog = logsBuild[i];
//           builtLog[cameraWithLogs.name] = 0;
//         }
//       }
//     });

//     // camerasWithLogs.map((camerasWithLogs) => {});

//     res.status(200).json(logsBuild);
//   } catch (error) {
//     console.warn(error);
//     res.status(500).json({ message: "server error" });
//   }
// });

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
