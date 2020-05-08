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
    defaultValue: false,
  },
  sms: {
    type: type.BOOLEAN,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    defaultValue: false,
  },
});
