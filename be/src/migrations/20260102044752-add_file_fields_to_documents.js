'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'file_path', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('documents', 'file_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('documents', 'file_size', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    
    await queryInterface.addColumn('documents', 'file_mimetype', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'file_path');
    await queryInterface.removeColumn('documents', 'file_name');
    await queryInterface.removeColumn('documents', 'file_size');
    await queryInterface.removeColumn('documents', 'file_mimetype');
  }
};
