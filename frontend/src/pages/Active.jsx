// Maintenance.jsx - UPDATED with 2 more containers
import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Active.css";

function Maintenance() {
  const maintenanceItems = [
    { 
      title: "Daily Cleaning Staff", 
      icon: "🧹", 
      desc: "Cleaning staff schedule & attendance",
      frequency: "Daily",
      status: "✅ Active",
      color: "#10b981"
    },
    { 
      title: "Tank Cleaning", 
      icon: "💧", 
      desc: "Water tank cleaning schedule", 
      frequency: "Every 3 Months",
      status: "⏳ Next: Apr 2026",
      color: "#f59e0b"
    },
    { 
      title: "Lightbill Payment", 
      icon: "💡", 
      desc: "Monthly electricity bill tracking",
      frequency: "Every Month",
      status: "⚠️ Due: Feb 25",
      color: "#ef4444"
    },
    // ✅ NEW CONTAINER 1 - ACTIVE STATUS
    { 
      title: "Lift Maintenance", 
      icon: "🛗", 
      desc: "Lift servicing & safety inspection",
      frequency: "Monthly",
      status: "There sis no lift",
      color: "#10b981"
    },
    // ✅ NEW CONTAINER 2 - CURRENTLY NOT ACTIVE (KHALI)
    { 
      title: "Garden Maintenance", 
      icon: "🌿", 
      desc: "Garden & landscaping services",
      frequency: "Bi-weekly",
      status: "❌ Not Active",
      color: "#6b7280"
    },
  ];

  return (
    <div className="maintenance-page">
      {/* Header */}
      <div className="maintenance-header">
        <h1>🔧 Maintenance Dashboard</h1>
        <p>Track all society maintenance activities</p>
      </div>

      {/* Maintenance Grid */}
      <div className="maintenance-grid">
        {maintenanceItems.map((item, index) => (
          <div key={index} className="maintenance-card" style={{borderLeftColor: item.color}}>
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
              <p>{item.desc}</p>
              <div className="card-frequency">
                📅 {item.frequency}
              </div>
            </div>
            
            <div className="card-footer">
              <Link to="#" className="view-details">View Details →</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">➕ Add New Task</button>
          <button className="action-btn secondary">📋 View Schedule</button>
          <button className="action-btn outline">📞 Call Staff</button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="maintenance-stats">
        <div className="stat-card">
          <div className="stat-number">5</div>
          <div className="stat-label">Active Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1</div>
          <div className="stat-label">Not Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">80%</div>
          <div className="stat-label">On Time</div>
        </div>
      </div> */}
    </div>
  );
}

export default Maintenance;