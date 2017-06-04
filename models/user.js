'use strict';

const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user, options, next) {
        // TODO: catch bcrypt errors
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
        next(null, user);
      }
    },

    instanceMethods: {
      isValidPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },

      toJSON() {
        return {
          id: this.id,
          name: this.name,
          email: this.email
        };
      }
    }
  });
  return User;
};
