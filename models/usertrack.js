'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserTrack = sequelize.define('UserTrack', {
    track_url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        UserTrack.belongsTo(models.User, {foreignKey: 'user_id'});
      }
    },

    instanceMethods: {
      toJSON() {
        return {
          id: this.id,
          user_id: this.user_id,
          track_url: this.track_url
        };
      }
    }
  });
  return UserTrack;
};
