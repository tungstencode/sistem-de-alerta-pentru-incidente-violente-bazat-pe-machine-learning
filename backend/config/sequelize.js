const Sequelize = require("sequelize");
const UserModel = require("../models/User");
const CameraModel = require("../models/Camera");
const SettingModel = require("../models/Setting");
const LogModel = require("../models/Log");

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

const force = true;

sequelize.sync({ force }).then(async () => {
  // eslint-disable-next-line no-console
  console.log("Database sync completed!");

  // dev only
  if (force) {
    const user = await User.create({
      cnp: "1981029394446",
      name: "lesin",
      email: "lesin@yahoo.com",
      password: "lesin",
    });
    const settings = await Setting.create();
    const camera = await Camera.create({
      name: "test",
      url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
      location: "30,20",
    });

    user.addCamera(camera, { through: { detect: true } });

    const userFound = await User.findByPk("1981029394446");

    const cameras = await userFound.getCameras();

    console.log(cameras[0].UserCamera.detect);
    // cameras[0].UserCamera.detect = false;

    await cameras[0].UserCamera.update({ detect: false });

    const cameras2 = await userFound.getCameras();

    console.log(cameras2[0].UserCamera.detect);
    
    await user.setSetting(settings);
  }
});

module.exports = {
  User,
  Camera,
  Setting,
  sequelize,
};
