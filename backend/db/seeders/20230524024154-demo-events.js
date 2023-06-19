'use strict';

let options = {};
options.tableName = "Events";
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
        groupId: 1,
        venueId: 1,
        name: "Sixers vs Nuggets @ Sports Bar",
        description: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 50,
        price: 10.5
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Eagles vs Cowboys",
        description: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 48,
        price: 3.5
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Villanova vs UNC",
        description: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 15,
        price: 4.5
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Game Night",
        description: "something about us something about us something about us something about us something about us something about us",
        type: "Online",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 5,
        price: 15.9
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
      groupId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
