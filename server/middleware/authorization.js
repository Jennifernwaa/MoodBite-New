// middleware/authorization.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // Get token from the header
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: "Unauthorized: No token provided or invalid format." });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(403).json({ error: "Unauthorized: Token missing." });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // If verification is successful, attach user ID to request
    req.user = payload.user;
    next(); // Proceed to the next middleware/route handler

  } catch (err) {
    // Handle token verification errors (e.g., JsonWebTokenError, TokenExpiredError)
    console.error("Authorization error:", err.message);
    return res.status(403).json({ error: `Unauthorized: ${err.message}` });
  }
};