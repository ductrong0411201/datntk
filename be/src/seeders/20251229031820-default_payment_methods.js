"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "payment_methods",
      [
        {
          id: 1,
          name: "Thanh toán trực tuyến",
          description: "Thanh toán qua hệ thống",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 2,
          name: "Thanh toán trực tiếp",
          description: "Thanh toán bằng tiền mặt hoặc chuyển khoản tại văn phòng",
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
    await queryInterface.bulkDelete("payment_methods", { id: [1, 2] }, {});
  },
};

