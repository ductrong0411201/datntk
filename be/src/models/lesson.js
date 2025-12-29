"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Cource, { foreignKey: "cource_id", as: "cource" });
      Lesson.hasMany(models.Document, { foreignKey: "lessonn_id", as: "documents" });
    }
  }
  Lesson.init(
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
      cource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "lessons",
      modelName: "Lesson",
    }
  );
  return Lesson;
};

