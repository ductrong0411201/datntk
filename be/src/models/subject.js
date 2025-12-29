"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      Subject.hasMany(models.User, { foreignKey: "subject_id", as: "users" });
      Subject.hasMany(models.Cource, { foreignKey: "subject_id", as: "cources" });
    }
  }
  Subject.init(
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
        unique: true,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: "subjects",
      modelName: "Subject",
    }
  );
  return Subject;
};

