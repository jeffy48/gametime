'use strict';

let options = {};
options.tableName = "Groups";
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
        organizerId: 1,
        name: "Bay Area Sixers",
        about: "something about us",
        type: "In person",
        private: true,
        city: "San Jose",
        state: "CA",
        previewImage: "https://wallpapers.com/images/hd/76ers-iphone-1rnx1wg22ng8ou01.jpg"
      },
      {
        organizerId: 1,
        name: "Mount Laurel Volleyball",
        about: "something about us",
        type: "In person",
        private: true,
        city: "Mount Laurel",
        state: "NJ"
      },
      {
        organizerId: 2,
        name: "Coffee and Boardgames",
        about: "something about us",
        type: "In person",
        private: false,
        city: "Mountain View",
        state: "CA"
      },
      {
        organizerId: 3,
        name: "Beginner Spanish Online",
        about: "something about us",
        type: "Online",
        private: true,
        city: "San Jose",
        state: "CA"
      },
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
      name: { [Op.in]: ['Bay Area Sixers', 'Mount Laurel Volleyball', 'Coffee and Boardgames', 'Beginner Spanish Online'] }
    }, {});
  }
};
