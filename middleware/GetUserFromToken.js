const jwt = require("jsonwebtoken");

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Invalid token.", error);
    return null;
  }
};

module.exports = getUserFromToken;
