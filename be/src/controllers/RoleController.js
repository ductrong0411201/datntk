const BaseController = require("./BaseController");
const { sendSuccess, sendCreated, sendBadRequest, sendNotFound } = require("../utils/response");
const models = require("../models");

class RoleController extends BaseController {
  constructor() {
    super("Role", {
      allowSearch: ["name", "code"],
      allowFilter: ["name", "code"],
      allowSort: ["name", "code", "createdAt", "updatedAt"]
    });
  }

  async getById(req, res) {
    try {
      const { Permission } = models;
      const item = await this.Model.findByPk(req.params.id, {
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["id", "resourceType", "action"],
            through: { attributes: [] }
          }
        ]
      });
      if (!item) {
        return sendNotFound(res, "Không tìm thấy");
      }
      return sendSuccess(res, item, "Lấy thông tin thành công");
    } catch (err) {
      console.error(err.message);
      return sendBadRequest(res, err.message || "Lỗi máy chủ");
    }
  }

  async create(req, res) {
    try {
      const { Permission } = models;
      const { permissions, ...roleData } = req.body;
      
      const role = await this.Model.create(roleData);
      
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        await role.setPermissions(permissions);
      }
      
      const roleWithPermissions = await this.Model.findByPk(role.id, {
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["id", "resourceType", "action"],
            through: { attributes: [] }
          }
        ]
      });
      
      return sendCreated(res, roleWithPermissions, "Tạo thành công");
    } catch (err) {
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }

  async update(req, res) {
    try {
      const { Permission } = models;
      const { permissions, ...roleData } = req.body;
      
      const item = await this.Model.findByPk(req.params.id);
      if (!item) {
        return sendNotFound(res, "Không tìm thấy");
      }
      
      await item.update(roleData);
      
      if (permissions !== undefined) {
        if (Array.isArray(permissions)) {
          await item.setPermissions(permissions);
        } else {
          await item.setPermissions([]);
        }
      }
      
      const roleWithPermissions = await this.Model.findByPk(item.id, {
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["id", "resourceType", "action"],
            through: { attributes: [] }
          }
        ]
      });
      
      return sendSuccess(res, roleWithPermissions, "Cập nhật thành công");
    } catch (err) {
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }
}

module.exports = new RoleController();

