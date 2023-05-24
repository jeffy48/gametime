'use strict';

let options = {};
options.tableName = "Members";
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
        groupId: 1,
        status: "Host"
      },
      {
        userId: 1,
        groupId: 2,
        status: "Host"
      },
      {
        userId: 2,
        groupId: 3,
        status: "Host"
      },
      {
        userId: 3,
        groupId: 4,
        status: "Host"
      },
      {
        userId: 4,
        groupId: 1,
        status: "Co-host"
      },
      {
        userId: 4,
        groupId: 2,
        status: "Member"
      },
      {
        userId: 4,
        groupId: 3,
        status: "Member"
      },
      {
        userId: 4,
        groupId: 4,
        status: "Pending"
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
