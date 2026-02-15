const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications
} = require("../controllers/notificationController");

// Admin → send
router.post("/", createNotification);

// Members → fetch
router.get("/", getNotifications);

module.exports = router;
