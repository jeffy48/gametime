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
        about: "A meetup group for Philadelphia 76ers fan in the Bay Area. We host game nights with good food and company at local businesses. Check us out!",
        type: "In person",
        private: true,
        city: "San Jose",
        state: "CA",
        previewImage: "https://cdn.abcotvs.com/dip/images/3327710_041118sixerslogo.jpg"
      },
      {
        organizerId: 2,
        name: "Redrock Coffee Club",
        about: "Please join us for monthly coffee tastings, classes, and hangouts with other coffee enthusiasts. Events are held at our award winning coffee shop in downtown MV. Anyone is welcomed",
        type: "In person",
        private: false,
        city: "Mountain View",
        state: "CA",
        previewImage: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg"
      },
      {
        organizerId: 3,
        name: "Eagles Games at Xfinity",
        about: "something about us something about us something about us something about us something about us something about us",
        type: "In person",
        private: false,
        city: "Philadelphia",
        state: "PA",
        previewImage: "https://e1.pxfuel.com/desktop-wallpaper/110/252/desktop-wallpaper-philadelphia-eagles-backgrounds-philadelphia-pa.jpg"
      },
      {
        organizerId: 4,
        name: "Cats cats cats",
        about: "we like cats we like cats we like cats we like cats we like cats we like cats we like cats we like cats we like cats we like cats we like cats we like cats",
        type: "Online",
        private: true,
        city: "New York",
        state: "NY",
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
