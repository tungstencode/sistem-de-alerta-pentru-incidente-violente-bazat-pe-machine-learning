module.exports = (sequelize, type) => sequelize.define("Camera", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: type.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  location: {
    type: type.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  url: {
    type: type.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  username: {
    type: type.STRING,
    allowNull: true,
    validate: {},
  },
  password: {
    type: type.STRING,
    allowNull: true,
    validate: {},
  },
  // detect: {
  //   type: type.BOOLEAN,
  //   allowNull: false,
  //   validate: {
  //     notEmpty: true,
  //   },
  //   defaultValue: false,
  // },
  // status: {
  //   type: type.STRING,
  //   allowNull: false,
  //   validate: {
  //     notEmpty: true,
  //     isIn: [["ON", "OFF", "MENTENANCE"]],
  //   },
  //   defaultValue: "ON",
  // },
});
