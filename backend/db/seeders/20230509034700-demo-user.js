'use strict';
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "Users";
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
      firstName: 'User',
      lastName: 'One',
      username: 'user1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'user2@user.io',
      firstName: 'User',
      lastName: 'Two',
      username: 'user2',
      hashedPassword: bcrypt.hashSync('password3')
    },
    {
      email: 'user3@user.io',
      firstName: 'User',
      lastName: 'Three',
      username: 'user3',
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
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'user1', 'user2', 'user3'] }
    }, {});
  }
};
