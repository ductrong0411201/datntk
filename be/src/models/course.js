"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Subject, { foreignKey: "subject_id", as: "subject" });
      Course.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
      Course.belongsToMany(models.User, {
        through: "course_student",
        foreignKey: "course_id",
        otherKey: "student_id",
        as: "students",
      });
      Course.hasMany(models.Lesson, { foreignKey: "course_id", as: "lessons" });
      Course.hasMany(models.Question, { foreignKey: "course_id", as: "questions" });
      Course.hasMany(models.Payment, { foreignKey: "course_id", as: "payments" });
    }
  }
  Course.init(
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
      tableName: "courses",
      modelName: "Course",
    }
  );
  return Course;
};

