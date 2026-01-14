const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtGenerator = require("../utils/jwt-generator");
const { sendSuccess, sendCreated, sendUnauthorized, sendNotFound, sendServerError, sendBadRequest } = require("../utils/response");

exports.register = async (req, res) => {
  try {
    const { name, userName, email, password, dateOfBirth, phoneNumber } = req.body;

    if (!name || !userName || !email || !password) {
      return sendBadRequest(res, "Vui lòng điền đầy đủ thông tin");
    }

    if (password.length < 6 || password.length > 64) {
      return sendBadRequest(res, "Mật khẩu phải có độ dài từ 6 đến 64 ký tự");
    }

    let cleanedPhoneNumber = null;
    if (phoneNumber) {
      cleanedPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
      if (!/^[0-9]{10,11}$/.test(cleanedPhoneNumber)) {
        return sendBadRequest(res, "Số điện thoại không hợp lệ");
      }
    }

    const oldUser = await User.findOne({ where: { [Op.or]: [{ email }, { userName }] } });
    if (oldUser) {
      if (oldUser.email === email) {
        return sendBadRequest(res, "Email đã được sử dụng");
      }
      if (oldUser.userName === userName) {
        return sendBadRequest(res, "Tên đăng nhập đã được sử dụng");
      }
    }

    const { Role } = require("../models");
    const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
    
    if (!studentRole) {
      return sendServerError(res, "Không tìm thấy role học sinh");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    let parsedDateOfBirth = null;
    if (dateOfBirth) {
      parsedDateOfBirth = new Date(dateOfBirth);
      if (isNaN(parsedDateOfBirth.getTime())) {
        return sendBadRequest(res, "Ngày sinh không hợp lệ");
      }
      const currentDate = new Date();
      if (parsedDateOfBirth > currentDate) {
        return sendBadRequest(res, "Ngày sinh không thể lớn hơn ngày hiện tại");
      }
      const year = parsedDateOfBirth.getFullYear();
      if (year < 1900) {
        return sendBadRequest(res, "Năm sinh không hợp lệ");
      }
    }
    
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
      role: studentRole.id,
      dateOfBirth: parsedDateOfBirth,
      phoneNumber: cleanedPhoneNumber,
    });

    return sendCreated(res, {
      id: newUser.id,
      name: newUser.name,
      userName: newUser.userName,
      email: newUser.email,
    }, "Đăng ký thành công");
  } catch (err) {
    console.error(err.message);
    
    if (err.name === "SequelizeUniqueConstraintError") {
      if (err.errors && err.errors.length > 0) {
        const field = err.errors[0].path;
        if (field === "email") {
          return sendBadRequest(res, "Email đã được sử dụng");
        }
        if (field === "userName") {
          return sendBadRequest(res, "Tên đăng nhập đã được sử dụng");
        }
      }
      return sendBadRequest(res, "Thông tin đăng ký đã tồn tại");
    }
    
    if (err.name === "SequelizeValidationError") {
      return sendBadRequest(res, err.errors?.[0]?.message || "Dữ liệu không hợp lệ");
    }
    
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
