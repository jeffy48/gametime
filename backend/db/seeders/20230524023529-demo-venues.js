'use strict';

let options = {};
options.tableName = "Venues";
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
        address: "123 Something Drive",
        city: "San Jose",
        state: "CA",
        lat: 37.7645358,
        lng: -122.4730327
      },
      {
        groupId: 2,
        address: "321 Random Street",
        city: "Mount Laurel",
        state: "NJ",
        lat: 37.3243235,
        lng: -125.2421432
      },
      {
        groupId: 3,
        address: "456 Something Lane",
        city: "Mountain View",
        state: "CA",
        lat: 32.1234567,
        lng: -120.1234567
      },
      {
        groupId: 4,
        address: "654 Random Way",
        city: "San Jose",
        state: "CA",
        lat: 35.1234567,
        lng: -110.1234567
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
