"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourceStudent extends Model {
    static associate(models) {
      CourceStudent.belongsTo(models.Cource, { foreignKey: "cource_id", as: "cource" });
      CourceStudent.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
    }
  }
  CourceStudent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "cource_student",
      modelName: "CourceStudent",
    }
  );
  return CourceStudent;
};

