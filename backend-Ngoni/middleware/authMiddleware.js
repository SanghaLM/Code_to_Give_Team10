const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  console.log(
    "authMiddleware: Checking token for request",
    req.method,
    req.url
  );
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token provided for request:", req.method, req.url);
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, user:", decoded);
    req.user = decoded; // contains { id, role }
    next();
  } catch (err) {
    console.error(
      "Invalid token for request:",
      req.method,
      req.url,
      err.message
    );
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
