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
        price: 10.5,
        previewImage: "https://cdn.vox-cdn.com/thumbor/nicFnDuPUwhJxMNoY368MZRnVgg=/0x0:3560x2373/1820x1213/filters:focal(1496x903:2064x1471):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70623700/1239199679.0.jpg"
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Coffee Tastings",
        description: "Come learn about the unique taste notes of coffee beans from all around the globe. Try out our beans from El Salvador, Guatemala, Ethiopia, Papa New Guinea, and more!",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 50,
        price: 5,
        previewImage: "https://assets.epicurious.com/photos/63e54a0664e14d52936a2937/16:9/w_2240,c_limit/CoffeeSubscriptions_IG_V1_030922_6350_V1_final.jpg"
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Eagles vs Cowboys",
        description: "Come watch us beat the cowboys",
        type: "In person",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 100,
        price: 10,
        previewImage: "https://static.clubs.nfl.com/image/private/t_editorial_landscape_12_desktop/cowboys/vxmhdymdpl5mt6mfk2u4"
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Game Night (with cats!)",
        description: "something about us something about us something about us something about us something about us something about us something about us something about us something about us something about us",
        type: "Online",
        startDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        endDate: Sequelize.literal('CURRENT_TIMESTAMP'),
        capacity: 10,
        price: 0,
        previewImage: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg"
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
