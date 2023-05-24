'use strict';

let options = {};
options.tableName = "Attendees";
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
        userId: 1,
        eventId: 1,
        status: "attending"
      },
      {
        userId: 2,
        eventId: 2,
        status: "attending"
      },
      {
        userId: 3,
        eventId: 3,
        status: "pending"
      },
      {
        userId: 4,
        eventId: 4,
        status: "waitlist"
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
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
