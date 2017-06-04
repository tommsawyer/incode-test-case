'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserTrack = sequelize.define('UserTrack', {
    track_url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        UserTrack.belongsTo(models.User, {foreignKey: 'user_id'});
      }
    }
  });
  return UserTrack;
};
