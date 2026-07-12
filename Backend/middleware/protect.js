const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};

module.exports = protect;