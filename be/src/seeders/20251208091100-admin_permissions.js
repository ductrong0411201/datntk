"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    const permissions = await queryInterface.sequelize.query(
      "SELECT id FROM permissions",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (permissions.length === 0) {
      console.log("No permissions found. Please run default_permissions seeder first.");
      return;
    }

    const rolePermissions = permissions.map((permission) => ({
      roleId: 1,
      permissionId: permission.id,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("role_permissions", rolePermissions, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions", { roleId: 1 }, {});
  },
};
