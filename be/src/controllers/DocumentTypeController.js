const BaseController = require("./BaseController");

class DocumentTypeController extends BaseController {
  constructor() {
    super("DocumentType", {
      allowSearch: ["name", "code"],
      allowFilter: ["id"],
      allowSort: ["id", "name", "code", "createdAt", "updatedAt"]
    });
  }
}

module.exports = new DocumentTypeController();

