'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Metadata', {
      contract: {
        type: Sequelize.STRING
      },
      publicKey: {
        type: Sequelize.STRING
      },
      cid: {
        type: Sequelize.STRING
      },
      creator: {
        type: Sequelize.STRING },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Metadata');
  }
};