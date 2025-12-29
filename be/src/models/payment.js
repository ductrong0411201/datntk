"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Payment.belongsTo(models.PaymentMethod, { foreignKey: "payment_method_id", as: "paymentMethod" });
      Payment.belongsTo(models.Cource, { foreignKey: "course_id", as: "course" });
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "payments",
      modelName: "Payment",
    }
  );
  return Payment;
};

