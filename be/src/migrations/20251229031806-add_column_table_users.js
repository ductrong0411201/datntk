'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'dateOfBirth', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'phoneNumber', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'subject_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'degree', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addConstraint('users', {
      fields: ['subject_id'],
      type: 'foreign key',
      name: 'fk_users_subject_id_subjects_id',
      references: {
        table: 'subjects',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'fk_users_subject_id_subjects_id');
    await queryInterface.removeColumn('users', 'dateOfBirth');
    await queryInterface.removeColumn('users', 'phoneNumber');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'subject_id');
    await queryInterface.removeColumn('users', 'degree');
    await queryInterface.removeColumn('users', 'isActive');
  }
};
