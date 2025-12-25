const { sendBadRequest } = require("../utils/response");

module.exports = function (req, res, next) {
  const { email, userNameOrEmail, userName, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, userName, name, password].every(Boolean)) {
      return sendBadRequest(res, "Thiếu thông tin đăng ký");
    } else if (!validEmail(email)) {
      return sendBadRequest(res, "Email không hợp lệ");
    }
  } else if (req.path === "/login") {
    if (!password || !userNameOrEmail) {
      return sendBadRequest(res, "Thiếu thông tin đăng nhập");
    }
  }
  next();
};
