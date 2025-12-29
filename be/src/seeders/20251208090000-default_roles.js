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
                {
                    id: 2,
                    name: "Quản lý",
                    code: "quanly",
                    description: "Quản lý",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    id: 3,
                    name: "Giáo viên",
                    code: "giaovien",
                    description: "Giáo viên",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    id: 4,
                    name: "Học sinh",
                    code: "hocsinh",
                    description: "Học sinh",
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

