'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      permissionId: {
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

    await queryInterface.addConstraint('role_permissions', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'fk_role_permissions_roleId_roles_id',
      references: {
        table: 'roles',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('role_permissions', {
      fields: ['permissionId'],
      type: 'foreign key',
      name: 'fk_role_permissions_permissionId_permissions_id',
      references: {
        table: 'permissions',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('role_permissions', ['roleId', 'permissionId'], {
      unique: true,
      name: 'unique_role_permission',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('role_permissions', 'unique_role_permission');
    await queryInterface.removeConstraint('role_permissions', 'fk_role_permissions_permissionId_permissions_id');
    await queryInterface.removeConstraint('role_permissions', 'fk_role_permissions_roleId_roles_id');
    await queryInterface.dropTable('role_permissions');
  },
};
