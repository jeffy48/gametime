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
        description: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 50,
        price: 10.00
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Volleyball at Laurel Acres",
        description: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 48,
        price: 3.00
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Boardgame Night at Red Rock",
        description: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 15,
        price: 0
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Spanish Nouns and Verbs Lesson",
        description: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        type: "Online",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 5,
        price: 15.00
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
