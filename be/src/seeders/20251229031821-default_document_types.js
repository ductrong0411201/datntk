"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "document_types",
      [
        {
          id: 1,
          name: "Tài liệu lớp học",
          code: "tai-lieu-lop-hoc",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 2,
          name: "Bài tập về nhà",
          code: "bai-tap-ve-nha",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("document_types", { id: [1, 2] }, {});
  },
};

