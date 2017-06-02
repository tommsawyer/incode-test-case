'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const changeEmailField = queryInterface.changeColumn(
      'Users',
      'email',
      {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      }
    );

    const changeNameField = queryInterface.changeColumn(
      'Users',
      'name',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    return Promise.all([ changeNameField, changeEmailField ]);
  },

  down: function (queryInterface, Sequelize) {
    const changeEmailField = queryInterface.changeColumn(
      'Users',
      'email',
      {
        type: Sequelize.STRING,
      }
    );

    const changeNameField = queryInterface.changeColumn(
      'Users',
      'name',
      {
        type: Sequelize.STRING,
      }
    );

    return Promise.all([ changeNameField, changeEmailField ]);
  }
};
