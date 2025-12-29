const { User } = require("../models");
const { sendError } = require("../utils/response");

module.exports = function (resourceType, action) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return sendError(res, 403, "Không có quyền truy cập");
      }

      const { Role, Permission } = require("../models");
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Role,
            as: "roleDetail",
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
      if (!user || !user.roleDetail || !user.roleDetail.permissions) {
        return sendError(res, 403, "Không có quyền truy cập");
      }

      const hasPermission = user.roleDetail.permissions.some(
        (permission) =>
          permission.resourceType === resourceType && permission.action === action
      );

      if (!hasPermission) {
        return sendError(res, 403, "Không có quyền truy cập");
      }

      next();
    } catch (err) {
      return sendError(res, 500, "Lỗi máy chủ");
    }
  };
};
