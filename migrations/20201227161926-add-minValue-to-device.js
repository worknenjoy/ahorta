'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Devices',
      'minValue',
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Devices',
      'minValue',
      Sequelize.INTEGER
    );
  }
};
