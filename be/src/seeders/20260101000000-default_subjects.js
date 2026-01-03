"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    const subjects = [
      {
        id: 1,
        name: "Toán",
        description: "Môn Toán học",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: "Ngữ Văn",
        description: "Môn Ngữ Văn",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: "Tiếng Anh",
        description: "Môn Tiếng Anh",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: "Hóa Học",
        description: "Môn Hóa Học",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        name: "Vật Lý",
        description: "Môn Vật Lý",
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const subject of subjects) {
      const existingSubject = await queryInterface.sequelize.query(
        `SELECT id FROM subjects WHERE id = ${subject.id}`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingSubject.length === 0) {
        await queryInterface.bulkInsert("subjects", [subject], {});
      } else {
        await queryInterface.bulkUpdate(
          "subjects",
          {
            name: subject.name,
            description: subject.description,
            updatedAt: now,
          },
          { id: subject.id }
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subjects", { id: [1, 2, 3, 4, 6] }, {});
  },
};

