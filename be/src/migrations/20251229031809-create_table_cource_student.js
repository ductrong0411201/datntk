'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cource_student', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('cource_student', {
      fields: ['cource_id'],
      type: 'foreign key',
      name: 'fk_cource_student_cource_id_cources_id',
      references: {
        table: 'cources',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('cource_student', {
      fields: ['student_id'],
      type: 'foreign key',
      name: 'fk_cource_student_student_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('cource_student', ['cource_id', 'student_id'], {
      unique: true,
      name: 'unique_cource_student',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('cource_student', 'unique_cource_student');
    await queryInterface.removeConstraint('cource_student', 'fk_cource_student_student_id_users_id');
    await queryInterface.removeConstraint('cource_student', 'fk_cource_student_cource_id_cources_id');
    await queryInterface.dropTable('cource_student');
  }
};

