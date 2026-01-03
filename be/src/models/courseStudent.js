"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseStudent extends Model {
    static associate(models) {
      CourseStudent.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
      CourseStudent.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
    }
  }
  CourseStudent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      course_id: {
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
      tableName: "course_student",
      modelName: "CourseStudent",
    }
  );
  return CourseStudent;
};

