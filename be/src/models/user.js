"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role", as: "roleDetail" });
      User.belongsTo(models.Subject, { foreignKey: "subject_id", as: "subject" });
      User.hasMany(models.Course, { foreignKey: "teacher_id", as: "taughtCourses" });
      User.belongsToMany(models.Course, {
        through: "course_student",
        foreignKey: "student_id",
        otherKey: "course_id",
        as: "enrolledCourses",
      });
      User.hasMany(models.Document, { foreignKey: "user_id", as: "documents" });
      User.hasMany(models.Question, { foreignKey: "user_id", as: "questions" });
      User.hasMany(models.Answer, { foreignKey: "user_id", as: "answers" });
      User.hasMany(models.Payment, { foreignKey: "user_id", as: "payments" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      userName: { type: DataTypes.STRING, unique: true, index: true },
      email: { type: DataTypes.STRING, unique: true, index: true },
      password: { type: DataTypes.STRING, validate: { len: [6, 64] } },
      role: DataTypes.INTEGER,
      dateOfBirth: DataTypes.DATE,
      phoneNumber: DataTypes.TEXT,
      address: DataTypes.TEXT,
      subject_id: DataTypes.INTEGER,
      degree: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
