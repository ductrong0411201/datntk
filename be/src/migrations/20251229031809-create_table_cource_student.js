'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('course_student', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course_id: {
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

    await queryInterface.addConstraint('course_student', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'fk_course_student_course_id_courses_id',
      references: {
        table: 'courses',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('course_student', {
      fields: ['student_id'],
      type: 'foreign key',
      name: 'fk_course_student_student_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('course_student', ['course_id', 'student_id'], {
      unique: true,
      name: 'unique_course_student',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('course_student', 'unique_course_student');
    await queryInterface.removeConstraint('course_student', 'fk_course_student_student_id_users_id');
    await queryInterface.removeConstraint('course_student', 'fk_course_student_course_id_courses_id');
    await queryInterface.dropTable('course_student');
  }
};

