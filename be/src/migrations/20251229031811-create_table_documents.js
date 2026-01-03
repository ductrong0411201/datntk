'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lessonn_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      document_type_id: {
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

    await queryInterface.addConstraint('documents', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_documents_user_id_users_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('documents', {
      fields: ['lessonn_id'],
      type: 'foreign key',
      name: 'fk_documents_lessonn_id_lessons_id',
      references: {
        table: 'lessons',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('documents', {
      fields: ['document_type_id'],
      type: 'foreign key',
      name: 'fk_documents_document_type_id_document_types_id',
      references: {
        table: 'document_types',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('documents', 'fk_documents_document_type_id_document_types_id');
    await queryInterface.removeConstraint('documents', 'fk_documents_lessonn_id_lessons_id');
    await queryInterface.removeConstraint('documents', 'fk_documents_user_id_users_id');
    await queryInterface.dropTable('documents');
  }
};

