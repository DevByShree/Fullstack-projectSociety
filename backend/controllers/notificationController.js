const Notification = require("../models/Notification");

// ADMIN SEND
exports.createNotification = async (req, res) => {
  const { title, message } = req.body;

  try {
    await Notification.create({ title, message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// MEMBER FETCH
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
