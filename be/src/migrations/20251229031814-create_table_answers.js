'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('answers', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_answers_user_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('answers', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_answers_question_id_questions_id',
      references: {
        table: 'questions',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('answers', 'fk_answers_user_id_users_id');
    await queryInterface.dropTable('answers');
  }
};

