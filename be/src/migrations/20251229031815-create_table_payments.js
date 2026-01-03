'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint('payments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_payments_user_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('payments', {
      fields: ['payment_method_id'],
      type: 'foreign key',
      name: 'fk_payments_payment_method_id_payment_methods_id',
      references: {
        table: 'payment_methods',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('payments', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'fk_payments_course_id_courses_id',
      references: {
        table: 'courses',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('payments', 'fk_payments_course_id_courses_id');
    await queryInterface.removeConstraint('payments', 'fk_payments_payment_method_id_payment_methods_id');
    await queryInterface.removeConstraint('payments', 'fk_payments_user_id_users_id');
    await queryInterface.dropTable('payments');
  }
};

