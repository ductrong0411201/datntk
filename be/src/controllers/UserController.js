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

  async list(req, res) {
    try {
      const { Role } = require("../models");
      const { sendSuccess, sendServerError } = require("../utils/response");
      
      // Xử lý filter theo roleCode trước khi build filter clause
      if (req.query.roleCode) {
        const role = await Role.findOne({ where: { code: req.query.roleCode } });
        if (role) {
          req.query.role = role.id;
        } else {
          // Nếu không tìm thấy role, trả về empty result
          return sendSuccess(res, {
            items: [],
            meta: {
              page: Math.max(parseInt(req.query.page, 10) || 1, 1),
              limit: Math.min(parseInt(req.query.limit, 10) || 10, 100),
              total: 0,
              totalPages: 0,
            },
          }, "Lấy danh sách thành công");
        }
      }
      
      // Gọi method của BaseController
      return super.list(req, res);
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  _getListOptions(req) {
    const { Role, Subject } = require("../models");
    const options = {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          as: "roleDetail",
          attributes: ["id", "name", "code", "description"]
        }
      ]
    };
    
    // Nếu filter theo roleCode là giaovien, thêm Subject vào include
    if (req.query.roleCode === "giaovien") {
      options.include.push({
        model: Subject,
        as: "subject",
        attributes: ["id", "name", "description"],
        required: false
      });
    }
    
    return options;
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

  async getTeachers(req, res) {
    try {
      const { Role } = require("../models");
      const { sendSuccess, sendServerError } = require("../utils/response");
      
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limitInput = parseInt(req.query.limit, 10);
      const limit = limitInput && limitInput > 0 ? Math.min(limitInput, 100) : 10;
      const offset = (page - 1) * limit;
      
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return sendSuccess(res, {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        }, "Lấy danh sách giáo viên thành công");
      }

      const { Subject } = require("../models");
      const { rows, count } = await User.findAndCountAll({
        where: { role: teacherRole.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          },
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name", "description"]
          }
        ],
        order: [["name", "ASC"]],
        offset,
        limit
      });

      return sendSuccess(res, {
        items: rows,
        meta: {
          page,
          limit,
          total: count,
          totalPages: Math.max(Math.ceil(count / limit), 1),
        },
      }, "Lấy danh sách giáo viên thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async getTeacherById(req, res) {
    try {
      const { Role } = require("../models");
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy",
          data: null
        });
      }

      const { Subject } = require("../models");
      const teacher = await User.findOne({
        where: { 
          id: req.params.id,
          role: teacherRole.id
        },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          },
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name", "description"]
          }
        ]
      });

      if (!teacher) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy giáo viên",
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        data: teacher,
        message: "Lấy thông tin giáo viên thành công"
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

  async createTeacher(req, res) {
    try {
      const { Role } = require("../models");
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò giáo viên",
          data: null
        });
      }

      const { name, userName, email, password, subject_id, degree, phoneNumber, address, dateOfBirth } = req.body;
      
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
      const newTeacher = await User.create({
        name,
        userName,
        email,
        password: hashedPassword,
        role: teacherRole.id,
        subject_id: subject_id || null,
        degree: degree || null,
        phoneNumber: phoneNumber || null,
        address: address || null,
        dateOfBirth: dateOfBirth || null
      });

      const { Subject } = require("../models");
      const teacherData = await User.findByPk(newTeacher.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          },
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name", "description"]
          }
        ]
      });

      return res.status(201).json({
        status: 201,
        data: teacherData,
        message: "Tạo giáo viên thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async updateTeacher(req, res) {
    try {
      const { Role } = require("../models");
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò giáo viên",
          data: null
        });
      }

      const teacher = await User.findOne({
        where: { 
          id: req.params.id,
          role: teacherRole.id
        }
      });

      if (!teacher) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy giáo viên",
          data: null
        });
      }

      const { name, userName, email, subject_id, degree, phoneNumber, address, dateOfBirth } = req.body;
      await teacher.update({ 
        name, 
        userName, 
        email,
        subject_id: subject_id || null,
        degree: degree || null,
        phoneNumber: phoneNumber || null,
        address: address || null,
        dateOfBirth: dateOfBirth || null
      });
      
      const { Subject } = require("../models");
      const updatedTeacher = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          },
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name", "description"]
          }
        ]
      });
      
      return res.status(200).json({
        status: 200,
        data: updatedTeacher,
        message: "Cập nhật giáo viên thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async changeTeacherPassword(req, res) {
    try {
      const { Role } = require("../models");
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò giáo viên",
          data: null
        });
      }

      const teacher = await User.findOne({
        where: { 
          id: req.params.id,
          role: teacherRole.id
        }
      });

      if (!teacher) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy giáo viên",
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
      await teacher.update({ password: hashedPassword });
      
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

  async deleteTeacher(req, res) {
    try {
      const { Role } = require("../models");
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      if (!teacherRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò giáo viên",
          data: null
        });
      }

      const teacher = await User.findOne({
        where: { 
          id: req.params.id,
          role: teacherRole.id
        }
      });

      if (!teacher) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy giáo viên",
          data: null
        });
      }

      await teacher.destroy();
      
      return res.status(200).json({
        status: 200,
        data: null,
        message: "Xóa giáo viên thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Xóa giáo viên thất bại",
        data: null
      });
    }
  }

  async getStudents(req, res) {
    try {
      const { Role } = require("../models");
      const { sendSuccess, sendServerError } = require("../utils/response");
      
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limitInput = parseInt(req.query.limit, 10);
      const limit = limitInput && limitInput > 0 ? Math.min(limitInput, 100) : 10;
      const offset = (page - 1) * limit;
      
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return sendSuccess(res, {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        }, "Lấy danh sách học sinh thành công");
      }

      const { rows, count } = await User.findAndCountAll({
        where: { role: studentRole.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          }
        ],
        order: [["name", "ASC"]],
        offset,
        limit
      });

      return sendSuccess(res, {
        items: rows,
        meta: {
          page,
          limit,
          total: count,
          totalPages: Math.max(Math.ceil(count / limit), 1),
        },
      }, "Lấy danh sách học sinh thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async getStudentById(req, res) {
    try {
      const { Role } = require("../models");
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy",
          data: null
        });
      }

      const student = await User.findOne({
        where: { 
          id: req.params.id,
          role: studentRole.id
        },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy học sinh",
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        data: student,
        message: "Lấy thông tin học sinh thành công"
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

  async createStudent(req, res) {
    try {
      const { Role } = require("../models");
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò học sinh",
          data: null
        });
      }

      const { name, userName, email, password, phoneNumber, address, dateOfBirth } = req.body;
      
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
      const newStudent = await User.create({
        name,
        userName,
        email,
        password: hashedPassword,
        role: studentRole.id,
        phoneNumber: phoneNumber || null,
        address: address || null,
        dateOfBirth: dateOfBirth || null
      });

      const studentData = await User.findByPk(newStudent.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code", "description"]
          }
        ]
      });

      return res.status(201).json({
        status: 201,
        data: studentData,
        message: "Tạo học sinh thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async updateStudent(req, res) {
    try {
      const { Role } = require("../models");
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò học sinh",
          data: null
        });
      }

      const student = await User.findOne({
        where: { 
          id: req.params.id,
          role: studentRole.id
        }
      });

      if (!student) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy học sinh",
          data: null
        });
      }

      const { name, userName, email, phoneNumber, address, dateOfBirth } = req.body;
      await student.update({ 
        name, 
        userName, 
        email,
        phoneNumber: phoneNumber || null,
        address: address || null,
        dateOfBirth: dateOfBirth || null
      });
      
      const updatedStudent = await User.findByPk(req.params.id, {
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
        data: updatedStudent,
        message: "Cập nhật học sinh thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Dữ liệu không hợp lệ",
        data: null
      });
    }
  }

  async changeStudentPassword(req, res) {
    try {
      const { Role } = require("../models");
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò học sinh",
          data: null
        });
      }

      const student = await User.findOne({
        where: { 
          id: req.params.id,
          role: studentRole.id
        }
      });

      if (!student) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy học sinh",
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
      await student.update({ password: hashedPassword });
      
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

  async deleteStudent(req, res) {
    try {
      const { Role } = require("../models");
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return res.status(400).json({
          status: 400,
          message: "Không tìm thấy vai trò học sinh",
          data: null
        });
      }

      const student = await User.findOne({
        where: { 
          id: req.params.id,
          role: studentRole.id
        }
      });

      if (!student) {
        return res.status(404).json({
          status: 404,
          message: "Không tìm thấy học sinh",
          data: null
        });
      }

      await student.destroy();
      
      return res.status(200).json({
        status: 200,
        data: null,
        message: "Xóa học sinh thành công"
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message || "Xóa học sinh thất bại",
        data: null
      });
    }
  }
}

module.exports = new UserController();

