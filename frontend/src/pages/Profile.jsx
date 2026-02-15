// Profile.jsx - DYNAMIC FROM localStorage ✅
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profileMenu, setProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 DYNAMIC USER DATA - Updates automatically from login
  const [userProfile, setUserProfile] = useState({
    id: 'USR-2026-001',
    name: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    flatNo: 'Loading...',
    role: 'loading',
    memberSince: "Jan 2025",
    status: "active"
  });

  // 🔥 LOAD USER DATA ON MOUNT + WATCH FOR CHANGES
  useEffect(() => {
    const loadUserProfile = () => {
      const name = localStorage.getItem("name") || "Resident Member";
      const email = localStorage.getItem("email") || "email@example.com";
      const phone = localStorage.getItem("phone") || "+91-XXXXXXXXX";
      const flatNo = localStorage.getItem("flatNo") || "A-101";
      const role = localStorage.getItem("role") || "resident";
      
      setUserProfile({
        id: `USR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name,
        email,
        phone,
        flatNo,
        role,
        memberSince: "Jan 2025", // Update from backend later
        status: "active"
      });
      
      setTimeout(() => setIsLoading(false), 800);
    };

    loadUserProfile();
    
    // 🔥 WATCH FOR localStorage changes (different tabs/sessions)
    window.addEventListener('storage', loadUserProfile);
    return () => window.removeEventListener('storage', loadUserProfile);
  }, []);

  // 🔥 DYNAMIC STATS based on role
  const stats = userProfile.role === "admin" ? {
    totalBills: 247,
    maintenanceRequests: 89,
    resolvedComplaints: 156,
    activeResidents: 128,
    monthlyRevenue: "₹4.2L"
  } : {
    totalBills: 12,
    maintenanceRequests: 3,
    resolvedComplaints: 1,
    dues: "₹0",
    flatNumber: userProfile.flatNo
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '📈' },
    { id: 'billing', label: 'Billing', icon: '💰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="profile-skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-main">
          <div className="skeleton-card"></div>
          <div className="skeleton-stats"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-enterprise">
      {/* Enterprise Header */}
      <header className="enterprise-header">
        <div className="header-container">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="header-title">
              <h1>Profile Management</h1>
              <div className="header-subtitle">User ID: {userProfile.id}</div>
            </div>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 14 3 18 3 18H21C21 18 18 14 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2.998 2.998 0 0 1-2.73 1.732A2.998 2.998 0 0 1 8.27 21a1 1 0 1 1 2-2c.445 0 .84.25 1.04.64.203.393.228.84.08 1.25-.14.398-.43.74-.83.9-.4.16-.87.14-1.24-.04-.37-.18-.66-.48-.78-.88-.12-.4-.08-.88.14-1.22.22-.34.6-.54.99-.54h.02c1.39 0 2.53 1.03 2.73 2.35z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>
      </header>

      <div className="enterprise-main">
        <div className="profile-layout">
          {/* Profile Sidebar - DYNAMIC DATA */}
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                <div className="avatar-initials">
                  {userProfile.role === "admin" ? "ADMIN" : userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="avatar-status"></div>
              </div>
              <div className="user-info">
                <h2>{userProfile.name}</h2> {/* 🔥 LIVE FROM LOGIN */}
                <div className="user-role">
                  {userProfile.role === "admin" ? "System Administrator" : "Resident Member"}
                </div>
                <div className="user-id">#{userProfile.id}</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="profile-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content - DYNAMIC DATA */}
          <div className="profile-content">
            {activeTab === 'overview' && (
              <div className="content-section">
                <div className="stats-metrics">
                  <div className="metric-card primary">
                    <div className="metric-icon">💰</div>
                    <div className="metric-value">{stats.totalBills}</div>
                    <div className="metric-label">Total Bills</div>
                  </div>
                  <div className="metric-card secondary">
                    <div className="metric-icon">🔧</div>
                    <div className="metric-value">{stats.maintenanceRequests}</div>
                    <div className="metric-label">Requests</div>
                  </div>
                  <div className="metric-card accent">
                    <div className="metric-icon">📝</div>
                    <div className="metric-value">{stats.resolvedComplaints}</div>
                    <div className="metric-label">Complaints</div>
                  </div>
                  {userProfile.role === "admin" && (
                    <div className="metric-card success">
                      <div className="metric-icon">👥</div>
                      <div className="metric-value">{stats.activeResidents}</div>
                      <div className="metric-label">Residents</div>
                    </div>
                  )}
                </div>

                <div className="profile-details-card">
                  <h3>Profile Details</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Email</label>
                      <div className="detail-value">{userProfile.email}</div> {/* 🔥 LIVE */}
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <div className="detail-value">{userProfile.phone}</div> {/* 🔥 LIVE */}
                    </div>
                    <div className="detail-item">
                      <label>Flat Number</label>
                      <div className="detail-value">{userProfile.flatNo}</div> {/* 🔥 LIVE */}
                    </div>
                    <div className="detail-item">
                      <label>Member Since</label>
                      <div className="detail-value">{userProfile.memberSince}</div>
                    </div>
                    <div className="detail-item">
                      <label>Account Status</label>
                      <div className={`status-badge ${userProfile.status}`}>{userProfile.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="content-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">💰</div>
                    <span>Paid electricity bill - ₹5,200</span>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🔧</div>
                    <span>Maintenance request submitted</span>
                    <div className="activity-time">1 day ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="action-bar">
          <button className="action-btn primary" onClick={() => navigate("/expenses")}>
            View Bills
          </button>
          <button className="action-btn secondary">
            Edit Profile
          </button>
          <button className="action-btn danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
