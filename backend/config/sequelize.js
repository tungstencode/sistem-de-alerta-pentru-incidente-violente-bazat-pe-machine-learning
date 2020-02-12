const Sequelize = require("sequelize");
const UserModel = require("../models/User");

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

sequelize.sync({ force: false }).then(() => {
  // eslint-disable-next-line no-console
  console.log("Database sync completed!");
});

module.exports = {
  User,
  sequelize,
};
