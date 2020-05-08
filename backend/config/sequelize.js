const Sequelize = require("sequelize");
const UserModel = require("../models/User");
const CameraModel = require("../models/Camera");
const SettingModel = require("../models/Setting");
const LogModel = require("../models/Log");
const moment = require("moment");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const User = UserModel(sequelize, Sequelize);
const Camera = CameraModel(sequelize, Sequelize);
const Setting = SettingModel(sequelize, Sequelize);
const Log = LogModel(sequelize, Sequelize);

const UserCamera = sequelize.define(
  "UserCamera",
  {
    detect: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      defaultValue: false,
    },
  },
  { timestamps: false },
);

User.belongsToMany(Camera, { through: UserCamera, foreignKey: "cnp" });
Camera.belongsToMany(User, { through: UserCamera, foreignKey: "id" });

User.hasOne(Setting);
Setting.belongsTo(User);

Camera.hasMany(Log);
Log.belongsTo(Camera);

let force = false;
let demo = false;
// force = true;
// demo = true;

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

sequelize.sync({ force }).then(async () => {
  // eslint-disable-next-line no-console
  console.log("Database sync completed!");

  if (demo) {
    const user = await User.create({
      cnp: "1981029394446",
      name: "Partenie Alex-Eduard",
      email: "parteniealex17@stud.ase.ro",
      password: "telefon",
      location: "44.4267674,26.1025384",
    });
    const settings = await Setting.create();
    await user.setSetting(settings);

    const cameraDetroit = await Camera.create({
      name: "New Case",
      url: "rtsp://35.238.94.67:1935/vod/mp4:detroit-repeat.mp4",
      location: "42.3314, 83.0458",
    });
    const cameraRussia = await Camera.create({
      name: "Val Case 1",
      url: "rtsp://35.238.94.67:1935/vod/mp4:russians-repeat.mp4",
      location: "61.5240, 105.3188",
    });
    const cameraFi027 = await Camera.create({
      name: "Val Case 2",
      url: "rtsp://192.168.0.106:1935/vod/mp4:fi027-repeat.mp4",
      location: "61.5240, 105.3188",
    });
    const cameraFi044 = await Camera.create({
      name: "Val Case 3",
      url: "rtsp://192.168.0.106:1935/vod/mp4:fi044-repeat.mp4",
      location: "61.5240, 105.3188",
    });
    const cameraFi046 = await Camera.create({
      name: "Val Case 4",
      url: "rtsp://192.168.0.106:1935/vod/mp4:fi047-repeat.mp4",
      location: "61.5240, 105.3188",
    });
    await user.addCamera(cameraDetroit, { through: { detect: false } });
    await user.addCamera(cameraRussia, { through: { detect: false } });
    await user.addCamera(cameraFi027, { through: { detect: false } });
    await user.addCamera(cameraFi044, { through: { detect: false } });
    await user.addCamera(cameraFi046, { through: { detect: false } });

    const cameras = await user.getCameras();

    cameras.map(async (camera) => {
      for (let i = 0; i < 20; i++) {
        const date = randomDate(new Date(2020, 0, 1), new Date());
        // eslint-disable-next-line no-await-in-loop
        const log = await Log.create({
          accurate: true,
          dateTime: moment(date)
            .valueOf()
            .toString(),
        });
        // eslint-disable-next-line no-await-in-loop
        await camera.addLog(log);
      }
    });
  }

  // dev only
  if (force) {
    // const user = await User.create({
    //   cnp: "1981029394446",
    //   name: "lesin",
    //   email: "lesin@yahoo.com",
    //   password: "lesin",
    //   location: "44.4267674,26.1025384",
    // });
    // const settings = await Setting.create();
    // const camera = await Camera.create({
    //   name: "test",
    //   url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
    //   location: "30,20",
    // });
    // user.addCamera(camera, { through: { detect: true } });
    // const camera2 = await Camera.create({
    //   name: "demo",
    //   url: "http://localhost:5001/demo",
    //   location: "44.4267674,26.1025384",
    // });
    // user.addCamera(camera2, { through: { detect: true } });
    // const userFound = await User.findByPk("1981029394446");
    // const cameras = await userFound.getCameras();
    // console.log(cameras[0].UserCamera.detect);
    // await cameras[0].UserCamera.update({ detect: false });
    // const cameras2 = await userFound.getCameras();
    // console.log(cameras2[0].UserCamera.detect);
    // await user.setSetting(settings);
    // const log = await Log.create({
    //   accurate: true,
    //   dateTime: moment("2020-04-02", "YYYY-MM-DD")
    //     .valueOf()
    //     .toString(),
    // });
    // const log2 = await Log.create({
    //   accurate: true,
    //   dateTime: moment("2020-04-02", "YYYY-MM-DD")
    //     .valueOf()
    //     .toString(),
    // });
    // const log3 = await Log.create({
    //   accurate: true,
    //   dateTime: moment("2020-04-04", "YYYY-MM-DD")
    //     .valueOf()
    //     .toString(),
    // });
    // const log4 = await Log.create({
    //   accurate: true,
    //   dateTime: moment("2020-04-04", "YYYY-MM-DD")
    //     .valueOf()
    //     .toString(),
    // });
    // await camera.addLog(log);
    // await camera.addLog(log2);
    // await camera2.addLog(log3);
    // await camera2.addLog(log4);
    // const logs = await camera.getLogs();
    // console.log(logs);
  }
});

module.exports = {
  User,
  Camera,
  Setting,
  sequelize,
  Log,
};
