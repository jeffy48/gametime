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
        previewImage: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg"
      },
      {
        organizerId: 2,
        name: "76ers Game Night",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: true,
        city: "Mount Laurel",
        state: "NJ",
        previewImage: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg"
      },
      {
        organizerId: 3,
        name: "Eagles Games at Xfinity",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: false,
        city: "Philadelphia",
        state: "PA",
        previewImage: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg"
      },
      {
        organizerId: 4,
        name: "March Madness Watch Party",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "Online",
        private: true,
        city: "Mountain View",
        state: "CA",
        previewImage: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg"
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
