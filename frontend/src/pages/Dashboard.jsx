// FIXED Dashboard.jsx - Security bottom nav → Coming Soon ✅
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import "../styles/dashboard.css";

const API_URL = "http://localhost:5000/api/notifications";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(localStorage.getItem("showNotifications") === "true");
  const [notifications, setNotifications] = useState([]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  const [showAdminNotificationModal, setShowAdminNotificationModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ title: "", message: "" });

  // 🔥 LOAD NOTIFICATIONS - TOKEN FIXED
  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) return;
      
      const data = await res.json();
      const formatted = data.map(n => ({
        id: n._id || Date.now() + Math.random(),
        title: n.title,
        message: n.message,
        time: new Date(n.createdAt || Date.now()).toLocaleString(),
        read: false
      }));

      setNotifications(formatted);
      setNotificationCount(formatted.filter(n => !n.read).length);
    } catch (error) {
      console.log("Notification load error:", error);
    }
  }, [token]);

  // 🔄 Auto reload every 3 seconds
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ✅ OPEN NOTIFICATION MODAL + SAVE STATE
  const handleNotificationClick = () => {
    setShowNotifications(true);
    localStorage.setItem("showNotifications", "true");
  };

  // ✅ CLOSE MODAL + CLEAR STATE
  const handleCloseNotifications = () => {
    setShowNotifications(false);
    localStorage.removeItem("showNotifications");
  };

  // 🔥 ADMIN SEND NOTIFICATION
  const handleAdminSendNotification = async () => {
    if (role !== "admin") return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      setNewMessage({ title: "", message: "" });
      setShowAdminNotificationModal(false);
      loadNotifications();
    } catch (error) {
      console.log("Send notification error:", error);
    }
  };

  // 🔥 MARK AS READ
  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotificationCount(updated.filter(n => !n.read).length);
      return updated;
    });
  }, []);

  // ✅ FIXED: ALL COMING SOON FEATURES (including Security)
  const mainItems = [
    { name: "Maintenance", icon: "🔧", path: "/maintenance" },
    { name: "Society Expenses", icon: "💰", path: "/expenses" },
    { name: "Problems", icon: "⚠️", path: "/problems" },
    { name: "Complaints", icon: "📝", path: "/complaints" },
    { name: "Security", icon: "🛡️", path: "/security" }, 
  ];

  // ✅ COMING SOON HANDLER
  const handleComingSoon = (featureName) => {
    setComingSoonFeature(featureName);
    setShowComingSoon(true);
  };

  // ✅ FIXED: handleLinkClick - Security bhi included ✅
  const handleLinkClick = (e, path, featureName) => {
    // ✅ ALL these paths show Coming Soon
    if (path === "/problems" || path === "/complaints" || path === "/security") {
      e.preventDefault();
      handleComingSoon(featureName);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      {/* TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <h3>🏠 Mohit Residency</h3>
        </div>

        <div className="nav-right">
          <button className="notification-btn" onClick={handleNotificationClick}>
            <div className="notification-icon">🔔</div>
            {notificationCount > 0 && (
              <div className="notification-badge">{notificationCount}</div>
            )}
          </button>

          {role === "admin" && (
            <button
              className="admin-notification-btn"
              onClick={() => setShowAdminNotificationModal(true)}
              title="Send notification to all members"
            >
              📢
            </button>
          )}

          <div className="profile-container" onClick={() => setProfileMenu(!profileMenu)}>
            <div className="profile-avatar">{role === "admin" ? "A" : "M"}</div>
            <div className="profile-info">
              <div className="profile-name">{role === "admin" ? "Admin" : "Member"}</div>
              <div className="profile-role">{role?.toUpperCase()}</div>
            </div>
            <i className="profile-arrow">▼</i>
            {profileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">👤 Profile</Link>
                <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <h2>{role === "admin" ? "Welcome Admin" : "Welcome Members"}</h2>
        </div>

        <div className="dashboard-grid">
          {mainItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="dashboard-card"
              onClick={(e) => handleLinkClick(e, item.path, item.name)}
            >
              <div className="card-icon">{item.icon}</div>
              <div className="card-title">{item.name}</div>
            </Link>
          ))}
        </div>

        <div className="thank-you-section enhanced">
          <div className="thank-you-icon">✨</div>
          <h3>Thank You for Visiting Mohit Residency Portal!</h3>
          <p>We appreciate your trust in our community management system.</p>
        </div>
      </div>

      {/* ADMIN SEND MODAL */}
      {showAdminNotificationModal && role === "admin" && (
        <div className="notification-modal-overlay" onClick={() => setShowAdminNotificationModal(false)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📢 Send Notification to All Members</h3>
              <button className="modal-close" onClick={() => setShowAdminNotificationModal(false)}>×</button>
            </div>
            <div className="admin-notification-form">
              <input
                type="text"
                placeholder="Title"
                value={newMessage.title}
                onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                className="notification-input"
              />
              <textarea
                placeholder="Message"
                value={newMessage.message}
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                className="notification-textarea"
                rows="4"
              />
              <button
                className="send-notification-btn"
                onClick={handleAdminSendNotification}
                disabled={!newMessage.title.trim() || !newMessage.message.trim()}
              >
                <span className="btn-icon">📢</span>
                <span className="btn-text">Send Notification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {showNotifications && (
        <div className="notification-modal-overlay" onClick={handleCloseNotifications}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔔 Notifications ({notificationCount})</h3>
              <button className="modal-close" onClick={handleCloseNotifications}>×</button>
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="notification-dot"></div>
                    <div className="notification-content">
                      <div className="notification-title">{notif.title}</div>
                      <div className="notification-message">{notif.message}</div>
                      <div className="notification-time">{notif.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ COMING SOON MODAL - Works for Security too! */}
      {showComingSoon && (
        <div className="modal-overlay" onClick={() => setShowComingSoon(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="coming-soon-icon">🚧</div>
            <h3>"{comingSoonFeature}" Coming Soon!</h3>
            <p>This feature is under development and will be available shortly.</p>
            <button className="btn-primary" onClick={() => setShowComingSoon(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
