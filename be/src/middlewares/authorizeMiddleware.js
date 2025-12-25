const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendError } = require("../utils/response");

module.exports = function (req, res, next) {
  const tokenFromCookie = req.cookies.token;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : null;
  
  const token = tokenFromCookie || tokenFromHeader;
  console.log('token',token);
  if (!token) {
    return sendError(res, 403, "Không có quyền truy cập");
  }
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify.user;
    next();
  } catch (err) {
    return sendError(res, 401, "Token không hợp lệ");
  }
};
