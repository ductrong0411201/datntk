"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const actions = ["CREATE", "READ", "UPDATE", "DELETE"];
    const resourceTypes = ["USER", "ROLE"];

    const permissions = [];
    let id = 1;

    for (const resourceType of resourceTypes) {
      for (const action of actions) {
        permissions.push({
          id: id++,
          resourceType: resourceType,
          action: action,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert("permissions", permissions, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
