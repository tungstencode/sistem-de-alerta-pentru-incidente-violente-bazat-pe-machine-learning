module.exports = (sequelize, type) => sequelize.define("Camera", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: type.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  location: {
    type: type.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  url: {
    type: type.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  username: {
    type: type.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  password: {
    type: type.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
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
