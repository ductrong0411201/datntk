"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cource extends Model {
    static associate(models) {
      Cource.belongsTo(models.Subject, { foreignKey: "subject_id", as: "subject" });
      Cource.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
      Cource.belongsToMany(models.User, {
        through: "cource_student",
        foreignKey: "cource_id",
        otherKey: "student_id",
        as: "students",
      });
      Cource.hasMany(models.Lesson, { foreignKey: "cource_id", as: "lessons" });
      Cource.hasMany(models.Question, { foreignKey: "cource_id", as: "questions" });
      Cource.hasMany(models.Payment, { foreignKey: "course_id", as: "payments" });
    }
  }
  Cource.init(
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
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "cources",
      modelName: "Cource",
    }
  );
  return Cource;
};

