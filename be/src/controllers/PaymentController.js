const BaseController = require("./BaseController");

class PaymentController extends BaseController {
  constructor() {
    super("Payment", {
      allowSearch: ["description"],
      allowFilter: ["id", "user_id", "payment_method_id", "course_id"],
      allowSort: ["id", "price", "date", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
    const { User, PaymentMethod, Course } = require("../models");
    return {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "userName", "email"]
        },
        {
          model: PaymentMethod,
          as: "paymentMethod",
          attributes: ["id", "name", "description"]
        },
        {
          model: Course,
          as: "course",
          attributes: ["id", "name", "price"]
        }
      ]
    };
  }
}

module.exports = new PaymentController();

