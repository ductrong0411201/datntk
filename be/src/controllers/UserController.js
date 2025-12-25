const BaseController = require("./BaseController");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models");

class UserController extends BaseController {
  constructor() {
    super("User", {
      allowSearch: ["name", "userName", "email"],
      allowFilter: ["id", "role"],
      allowSort: ["id", "name", "userName", "email", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
    const { Role } = require("../models");
    return {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          as: "roleDetail",
          attributes: ["id", "name", "code", "description"]
        }
      ]
    };
  }

  async getById(req, res) {
    try {
      const { Role } = require("../models");
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          }
        ]
      });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy",
          data: null
        });
      }
      return res.status(200).json({
        status: 200,
        data: user,
        message: "Lấy thông tin thành công"
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        status: 500,
        message: "Lỗi máy chủ",
        data: null
      });
    }
  }

  async create(req, res) {
    try {
      const { name, userName, email, password, role } = req.body;
      
      // Check if trying to create admin user by role code
      if (role) {
        const { Role } = require("../models");
        const selectedRole = await Role.findByPk(role);
        if (selectedRole && selectedRole.code === "admin") {
          return res.status(403).json({
            status: 403,
            message: "Không được phép tạo người dùng với vai trò Administrator",
            data: null
          });
        }
      }
      
      const oldUser = await User.findOne({ 
        where: { [Op.or]: [{ email }, { userName }] } 
      });
      if (oldUser) {
        return res.status(400).json({
          status: 400,
          message: "Người dùng đã tồn tại!",
          data: null
        });
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        name,
        userName,
        email,
        password: hashedPassword,
        role: role || 2
      });
      const userData = newUser.toJSON();
      delete userData.password;
      return res.status(201).json({
        status: 201,
        data: userData,
        message: "Tạo người dùng thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async update(req, res) {
    try {
      const { Role } = require("../models");
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy",
          data: null
        });
      }
      const { name, userName, email, role } = req.body;
      const updateData = { name, userName, email, role };
      
      await user.update(updateData);
      
      const updatedUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          }
        ]
      });
      
      return res.status(200).json({
        status: 200,
        data: updatedUser,
        message: "Cập nhật thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async changePassword(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy người dùng",
          data: null
        });
      }
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({
          status: 400,
          message: "Mật khẩu không được để trống",
          data: null
        });
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      await user.update({ password: hashedPassword });
      
      return res.status(200).json({
        status: 200,
        data: null,
        message: "Đổi mật khẩu thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Đổi mật khẩu thất bại",
        data: null
      });
    }
  }
}

module.exports = new UserController();

