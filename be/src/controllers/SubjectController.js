const BaseController = require("./BaseController");

class SubjectController extends BaseController {
  constructor() {
    super("Subject", {
      allowSearch: ["name", "description"],
      allowFilter: ["id"],
      allowSort: ["id", "name", "createdAt", "updatedAt"]
    });
  }
}

module.exports = new SubjectController();

