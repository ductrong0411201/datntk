const BaseController = require("./BaseController");

class PermissionController extends BaseController {
  constructor() {
    super("Permission", {
      allowSearch: ["resourceType", "action"],
      allowFilter: ["resourceType", "action"],
      allowSort: ["resourceType", "action", "createdAt", "updatedAt"]
    });
  }
}

module.exports = new PermissionController();
