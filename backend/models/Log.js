module.exports = (sequelize, type) => sequelize.define("Log", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accurate: {
    type: type.BOOLEAN,
    allowNull: true,
    validate: {
      notEmpty: false,
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
