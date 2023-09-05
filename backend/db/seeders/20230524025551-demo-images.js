'use strict';

let options = {};
options.tableName = "Images";
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
        imageableId: 1,
        imageableType: "Group",
        url: "https://cdn.abcotvs.com/dip/images/3327710_041118sixerslogo.jpg",
        preview: true
      },
      {
        imageableId: 1,
        imageableType: "Event",
        url: "https://cdn.vox-cdn.com/thumbor/nicFnDuPUwhJxMNoY368MZRnVgg=/0x0:3560x2373/1820x1213/filters:focal(1496x903:2064x1471):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70623700/1239199679.0.jpg",
        preview: true
      },
      {
        imageableId: 2,
        imageableType: "Group",
        url: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg",
        preview: true
      },
      {
        imageableId: 2,
        imageableType: "Event",
        url: "https://assets.epicurious.com/photos/63e54a0664e14d52936a2937/16:9/w_2240,c_limit/CoffeeSubscriptions_IG_V1_030922_6350_V1_final.jpg",
        preview: true
      },
      {
        imageableId: 3,
        imageableType: "Group",
        url: "https://e1.pxfuel.com/desktop-wallpaper/110/252/desktop-wallpaper-philadelphia-eagles-backgrounds-philadelphia-pa.jpg",
        preview: true
      },
      {
        imageableId: 3,
        imageableType: "Event",
        url: "https://static.clubs.nfl.com/image/private/t_editorial_landscape_12_desktop/cowboys/vxmhdymdpl5mt6mfk2u4",
        preview: true
      },
      {
        imageableId: 4,
        imageableType: "Group",
        url: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg",
        preview: true
      },
      {
        imageableId: 4,
        imageableType: "Event",
        url: "https://www.thesprucepets.com/thmb/uQnGtOt9VQiML2oG2YzAmPErrHo=/5441x0/filters:no_upscale():strip_icc()/all-about-tabby-cats-552489-hero-a23a9118af8c477b914a0a1570d4f787.jpg",
        preview: true
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
      imageableId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
