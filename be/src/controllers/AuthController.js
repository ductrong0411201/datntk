const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtGenerator = require("../utils/jwt-generator");
const { sendSuccess, sendCreated, sendUnauthorized, sendNotFound, sendServerError } = require("../utils/response");

exports.register = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const oldUser = await User.findOne({ where: { [Op.or]: [{ email }, { userName }] } });
    if (oldUser) {
      return sendUnauthorized(res, "Người dùng đã tồn tại!");
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });
    return sendCreated(res, {
      id: newUser.id,
      name: newUser.name,
      userName: newUser.userName,
      email: newUser.email,
    }, "Tạo người dùng thành công");
  } catch (err) {
    console.error(err.message);
    return sendServerError(res, "Lỗi máy chủ");
  }
};

exports.login = async (req, res) => {
  try {
    const { userNameOrEmail, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
      },
    });
    if (!user) {
      return sendUnauthorized(res, "Thông tin đăng nhập không hợp lệ");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendUnauthorized(res, "Thông tin đăng nhập không hợp lệ");
    }
    const token = jwtGenerator(user.id);
    return res
      .cookie("token", token, { httpOnly: true })
      .json({ 
        status: 200, 
        data: { token: token },
        message: "Đăng nhập thành công"
      });
  } catch (err) {
    console.error(err.message);
    return sendServerError(res, "Lỗi máy chủ");
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    return sendSuccess(res, null, "Đăng xuất thành công");
  } catch (err) {
    return sendServerError(res, "Lỗi máy chủ");
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { Role, Permission } = require("../models");
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          as: "roleDetail",
          attributes: ["id", "name", "code", "description"],
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "resourceType", "action"],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });
    if (!user) {
      return sendNotFound(res, "Không tìm thấy người dùng");
    }
    return sendSuccess(res, user, "Lấy thông tin người dùng thành công");
  } catch (err) {
    console.error(err.message);
    return sendServerError(res, "Lỗi máy chủ");
  }
};
