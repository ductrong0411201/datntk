const BaseController = require("./BaseController");

class PaymentMethodController extends BaseController {
  constructor() {
    super("PaymentMethod", {
      allowSearch: ["name", "description"],
      allowFilter: ["id"],
      allowSort: ["id", "name", "createdAt", "updatedAt"]
    });
  }
}

module.exports = new PaymentMethodController();

