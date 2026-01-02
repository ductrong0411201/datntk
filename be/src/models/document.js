"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Document.belongsTo(models.Lesson, { foreignKey: "lessonn_id", as: "lesson" });
      Document.belongsTo(models.DocumentType, { foreignKey: "document_type_id", as: "documentType" });
    }
  }
  Document.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lessonn_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      document_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_mimetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "documents",
      modelName: "Document",
    }
  );
  return Document;
};

