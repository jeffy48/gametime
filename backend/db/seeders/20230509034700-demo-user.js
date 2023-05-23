'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Users';
   await queryInterface.bulkInsert(options, [
    {
      email: 'demo@user.io',
      firstName: 'Demo',
      lastName: 'Lition',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      email: 'user1@user.io',
      firstName: 'Fake',
      lastName: 'User',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'test@user.io',
      firstName: 'Test',
      lastName: 'User',
      username: 'TestUser',
      hashedPassword: bcrypt.hashSync('password3')
    },
    {
      email: 'jeffy@gmail.com',
      firstName: 'Jeff',
      lastName: 'Yoon',
      username: 'jeffy48',
      hashedPassword: bcrypt.hashSync('password4')
    }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'TestUser', 'jeffy48'] }
    }, {});
  }
};
