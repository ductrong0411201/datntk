"use strict";

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const hashed = bcrypt.hashSync("admin@123", 12);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          name: "Admin",
          userName: "admin",
          email: "admin@example.com",
          password: hashed,
          role: 1,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@example.com" }, {});
  },
};

