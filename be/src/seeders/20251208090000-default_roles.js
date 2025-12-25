"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "roles",
            [
                {
                    id: 1,
                    name: "Administrator",
                    code: "admin",
                    description: "System administrator",
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("roles", { id: [1] }, {});
    },
};

