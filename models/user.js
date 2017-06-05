'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_photo: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user, options, next) {
        // TODO: catch bcrypt errors
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
        next(null, user);
      },

      beforeUpdate(user, options, next) {
        if (options.fields.indexOf('password') !== -1) {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(user.password, salt);
          user.password = hashedPassword;
        }

        if (options.fields.indexOf('profile_photo') !== -1) {
          const previousProfilePhoto = user._previousDataValues.profile_photo;
          user.deletePhotoSync(previousProfilePhoto);
        }

        next(null, user);
      },

      beforeDestroy(user, options, next) {
        user.deletePhotoSync();
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
          email: this.email,
          profile_photo: this.profile_photo
        };
      },

      deletePhotoSync(filename) {
        const photoPath = `${__dirname}/../public/${filename || this.profile_photo}`;
        fs.unlinkSync(photoPath);
      }
    }
  });
  return User;
};
