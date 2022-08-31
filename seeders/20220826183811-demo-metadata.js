'use strict';

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
     await queryInterface.bulkInsert('Metadata', [{
      cid: "ipfs/QmWm8E1qgdtQ5itMLb4wk1eYtHUmZfocVsjjgJ5qd6Ar4K",
      publicKey: "clzs",
      contract: "0x707dC5d315CA2c575a24DFAcbD210708B4b2eA83",
      creator: "0xEdd3783e8c7c52b80cfBD026a63C207Edc9CbeE7",
      createdAt: new Date(),
      updatedAt: new Date()
       }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
