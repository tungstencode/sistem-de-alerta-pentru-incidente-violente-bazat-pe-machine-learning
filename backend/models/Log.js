module.exports = (sequelize, type) => sequelize.define("Log", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accurate: {
    type: type.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notEmpty: true,
    },
  },
  dateTime: {
    type: type.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});
