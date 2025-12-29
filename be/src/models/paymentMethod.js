"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.hasMany(models.Payment, { foreignKey: "payment_method_id", as: "payments" });
    }
  }
  PaymentMethod.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: "payment_methods",
      modelName: "PaymentMethod",
    }
  );
  return PaymentMethod;
};

