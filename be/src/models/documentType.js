"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DocumentType extends Model {
    static associate(models) {
      DocumentType.hasMany(models.Document, { foreignKey: "document_type_id", as: "documents" });
    }
  }
  DocumentType.init(
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "document_types",
      modelName: "DocumentType",
    }
  );
  return DocumentType;
};

