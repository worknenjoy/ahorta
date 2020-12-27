'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('Users', [{
        name: 'Demo User',
        email: 'demo@email.com',
        password: 'demo',
        createdAt: '2019-09-06',
        updatedAt: '2019-09-06'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('Users', null, {});
    
  }
};
