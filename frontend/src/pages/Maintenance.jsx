// Maintenance.jsx - ✅ Active/Not Active SEPARATE PAGES
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/maintenance.css";

function Maintenance() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationCount] = useState(3);

  // ✅ Status decide karega konsa page open karega
  const handleCardClick = (isActive) => {
    if (isActive) {
      navigate("/active-page");  // ✅ Active page
    } else {
      navigate("/not-active-page");  // ❌ Not active page
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const maintenanceItems = [
    { 
      title: "Active Maintenance", 
      icon: "✅", 
      status: "Active",
      color: "#10b981",
      isActive: true  // ✅ Active hai
    },
    { 
      title: "Not Active Maintenance", 
      icon: "❌", 
      status: "Not Active",
      color: "#6b7280",
      isActive: false  // ❌ Not active hai
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <h3>🏠 Mohit Residency</h3>
        </div>
        
        <div className="nav-right">
          <Link to="/notifications" className="notification-btn">
            <div className="notification-icon">🔔</div>
            {notificationCount > 0 && (
              <div className="notification-badge">{notificationCount}</div>
            )}
          </Link>

          <div className="profile-container" onClick={() => setProfileMenu(!profileMenu)}>
            <div className="profile-avatar">
              {role === "admin" ? "A" : "M"}
            </div>
            <div className="profile-info">
              <div className="profile-name">{role === "admin" ? "Admin" : "Member"}</div>
              <div className="profile-role">{role?.toUpperCase()}</div>
            </div>
            <i className="profile-arrow">▼</i>
            
            {profileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MAINTENANCE CONTENT */}
      <div className="maintenance-page">
        <div className="maintenance-header">
          <h1>🔧 Maintenance Status</h1>
        </div>

        <div className="maintenance-grid">
          {maintenanceItems.map((item, index) => (
            <div 
              key={index} 
              className="maintenance-card" 
              style={{borderLeftColor: item.color}}
              onClick={() => handleCardClick(item.isActive)}  // ✅ Different pages
            >
              <div className="card-header">
                <div className="card-icon" style={{backgroundColor: item.color + '20'}}>
                  {item.icon}
                </div>
                <div className="card-status" style={{backgroundColor: item.color + '15'}}>
                  {item.status}
                </div>
              </div>
              
              <div className="card-body">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAVBAR */}
      <nav className="bottom-navbar">
        <Link to="/dashboard" className="bottom-nav-item">
          <div className="bottom-nav-icon">📊</div>
          <div className="bottom-nav-label">Dashboard</div>
        </Link>
        <Link to="/maintenance" className="bottom-nav-item active">
          <div className="bottom-nav-icon">🔧</div>
          <div className="bottom-nav-label">Maintenance</div>
        </Link>
        <Link to="/profile" className="bottom-nav-item">
          <div className="bottom-nav-icon">👤</div>
          <div className="bottom-nav-label">Profile</div>
        </Link>
        <Link to="/security" className="bottom-nav-item">
          <div className="bottom-nav-icon">🛡️</div>
          <div className="bottom-nav-label">Security</div>
        </Link>
        <Link to="/notifications" className="bottom-nav-item">
          <div className="bottom-nav-icon">🔔</div>
          <div className="bottom-nav-label">Notif</div>
        </Link>
      </nav>
    </div>
  );
}

export default Maintenance;
