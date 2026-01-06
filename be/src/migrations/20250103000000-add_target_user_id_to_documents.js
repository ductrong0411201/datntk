'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'target_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('documents', {
      fields: ['target_user_id'],
      type: 'foreign key',
      name: 'fk_documents_target_user_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('documents', 'fk_documents_target_user_id_users_id');
    await queryInterface.removeColumn('documents', 'target_user_id');
  }
};

