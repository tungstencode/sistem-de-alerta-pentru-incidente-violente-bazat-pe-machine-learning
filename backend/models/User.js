const bcrypt = require("bcrypt");

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
module.exports = (sequelize, type) => {
  const User = sequelize.define("User", {
    cnp: {
      type: type.STRING,
      primaryKey: true,
      validate: {
        len: 13,
      },
      // autoIncrement: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
      validate: {
        len: [5, 20],
      },
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    email: {
      type: type.STRING,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
      unique: true,
    },
    location: {
      type: type.STRING,
      allowNull: true,
    },
    // type: {
    //   type: type.STRING,
    //   validate: {
    //     isIn: [["ADMIN", "GUARDIAN"]],
    //     notEmpty: true,
    //   },
    // },
  });
  User.addHook("beforeCreate", (user) => {
    // eslint-disable-next-line no-param-reassign
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(saltRounds),
      null,
    );
  });
  // User.addHook("beforeUpdate", (user) => {
  //   // eslint-disable-next-line no-param-reassign
  //   user.password = bcrypt.hashSync(
  //     user.password,
  //     bcrypt.genSaltSync(saltRounds),
  //     null,
  //   );
  // });
  return User;
};
