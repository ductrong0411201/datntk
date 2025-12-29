"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Question.belongsTo(models.Cource, { foreignKey: "cource_id", as: "cource" });
      Question.hasMany(models.Answer, { foreignKey: "question_id", as: "answers" });
    }
  }
  Question.init(
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
      cource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "questions",
      modelName: "Question",
    }
  );
  return Question;
};

