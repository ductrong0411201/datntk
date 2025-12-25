const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, expiresIn = "2h") {
  const payload = {
    user: {
      id: user_id,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
}
module.exports = jwtGenerator;