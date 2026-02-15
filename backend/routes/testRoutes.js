const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

console.log("protect =", protect);
console.log("adminOnly =", adminOnly);

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/member", protect, (req, res) => {
  res.json({ message: "Welcome Member" });
});

module.exports = router;
