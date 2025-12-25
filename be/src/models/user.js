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
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        index: true,
      },
      name: DataTypes.STRING,
      userName: { type: DataTypes.STRING, unique: true, index: true },
      email: { type: DataTypes.STRING, unique: true, index: true },
      password: { type: DataTypes.STRING, validate: { len: [6, 64] } },
      role: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
