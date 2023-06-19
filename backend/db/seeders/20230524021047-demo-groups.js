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
        about: "something about us something about us something about us something about us something about us something about ussomething about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: true,
        city: "San Jose",
        state: "CA",
        previewImage: "https://wallpapers.com/images/hd/76ers-iphone-1rnx1wg22ng8ou01.jpg"
      },
      {
        organizerId: 2,
        name: "76ers Game Night",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: true,
        city: "Mount Laurel",
        state: "NJ"
      },
      {
        organizerId: 3,
        name: "Eagles Games at Xfinity",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: false,
        city: "Philadelphia",
        state: "PA"
      },
      {
        organizerId: 4,
        name: "March Madness Watch Party",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "Online",
        private: true,
        city: "Mountain View",
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
      id: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
