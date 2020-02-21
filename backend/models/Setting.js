module.exports = (sequelize, type) => sequelize.define("Setting", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sound: {
    type: type.BOOLEAN,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    defaultValue: true,
  },
  // sms: {
  //   type: type.STRING,
  //   allowNull: true,
  //   validate: {
  //     notEmpty: true,
  //   },
  // },
});
