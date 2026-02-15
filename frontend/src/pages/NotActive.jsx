// pages/NotActive.jsx - ✅ ADMIN ONLY NEW TASK BUTTON + POPUP
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/NotActive.css";

// WALL
import image1 from "../assets/window.jpeg";
import image2 from "../assets/wall2.jpeg";
import image3 from "../assets/wall3.jpeg";
import image7 from "../assets/wall4.jpeg";
import image16 from "../assets/wall5.jpeg";

// ELECTRIC
import image4 from "../assets/elec1.jpeg";
import image5 from "../assets/elec2.jpeg";
import image6 from "../assets/elec3.jpeg";
import image15 from "../assets/elec4.jpeg";
import image155 from "../assets/elec5.jpeg";

// CLEANING
import image10 from "../assets/clean1.jpeg";
import image11 from "../assets/clean2.jpeg";
import image12 from "../assets/clean3.jpeg";
import image14 from "../assets/clean4.jpeg";
import image17 from "../assets/clean5.jpeg";

// OTHERS
import image18 from "../assets/park.jpeg";
import image19 from "../assets/pipe1.jpeg";
import image22 from "../assets/pipe2.jpeg";
import image20 from "../assets/gate1.jpeg";
import image21 from "../assets/gate2.jpeg";
import image13 from "../assets/box.jpeg";

function NotActive() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('');
  
  // 🔥 NEW TASK MODAL STATE - ADMIN ONLY
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 NEW TASK BUTTON CLICK - ADMIN ONLY
  const handleNewTaskClick = () => {
    setShowNewTaskModal(true);
  };

  // 🔥 NEW TASK SUBMIT
  const handleNewTaskSubmit = () => {
    alert("✅ New task created successfully! 🎉");
    setShowNewTaskModal(false);
  };

  // 🔥 CLOSE MODAL
  const closeNewTaskModal = () => {
    setShowNewTaskModal(false);
  };

  const notActiveItems = [
    { title: "Parking Potholes", icon: "🚗", color: "#eaebed", images: [image18] },
    { title: "Pipe Maintenance", icon: "🚿", color: "#ef4444", images: [image19] },
    { title: "Broken Window Repair", icon: "🪟", color: "#f59e0b", images: [image1] },
    { title: "Borewell Water Maintenance", icon: "💧", color: "#10b981", images: [image15] },
    { title: "Society Deep Cleaning", icon: "🧹", color: "#3b82f6", images: [image10, image11, image12, image14, image17] },
    { title: "Society Wall Repair", icon: "🧱", color: "#8b5cf6", images: [image2, image3, image7, image16] },
    { title: "Gate Repair", icon: "🚪", color: "#ec4899", images: [image20, image21] },
    { title: "Society Earthing", icon: "⚡", color: "#f97316", images: [image4, image5, image6, image15, image155] },
    { title: "Motor Repair", icon: "🔧", color: "#14b8a6", images: [image15] },
  ];

  const handleCardClick = useCallback((itemImages, itemTitle, startIndex = 0) => {
    setSelectedImage(itemImages);
    setCurrentTitle(itemTitle);
    setCurrentIndex(startIndex);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? selectedImage.length - 1 : prevIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex === selectedImage.length - 1 ? 0 : prevIndex + 1);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
    setCurrentTitle('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') closeImageModal();
      }
      if (showNewTaskModal && e.key === 'Escape') {
        closeNewTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, showNewTaskModal]);

  // 🔥 MAIN VIEW - SHOWS NEW TASK BUTTON ONLY FOR ADMIN
  if (!selectedImage && !showNewTaskModal) {
    return (
      <div className="dashboard-wrapper">
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

        <div className="maintenance-page">
          <div className="maintenance-header">
            <h1>❌ Not Active Maintenance</h1>
            <p>Click any card to view actual photos</p>
          </div>

          {/* 🔥 ADD NEW TASK BUTTON - ADMIN ONLY */}
          {role === "admin" && (
            <div className="action-section-top">
              <button className="action-btn primary add-new-task" onClick={handleNewTaskClick}>
                ➕ Add New Task
              </button>
            </div>
          )}

          <div className="maintenance-grid">
            {notActiveItems.map((item, index) => (
              <div
                key={index}
                className="maintenance-card"
                style={{ borderLeftColor: item.color, cursor: 'pointer' }}
                onClick={() => handleCardClick(item.images, item.title)}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ backgroundColor: item.color + '20' }}>
                    {item.icon}
                  </div>
                  <div className="card-status" style={{ backgroundColor: item.color + '15' }}>
                    ❌ Inactive ({item.images.length} photos)
                  </div>
                </div>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Tap to see real images</p>
                </div>
              </div>
            ))}
          </div>

          <div className="action-section">
            <Link to="/maintenance" className="action-btn primary">
              ← Back to Maintenance Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 IMAGE VIEWER MODAL
  if (selectedImage) {
    return (
      <div className="image-modal-overlay" onClick={closeImageModal}>
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeImageModal}>×</button>
          <div className="image-gallery">
            <img
              src={selectedImage[currentIndex]}
              alt="Maintenance"
              className="modal-image"
            />
            <div className="image-counter">
              {currentIndex + 1} / {selectedImage.length}
            </div>
          </div>
          <div className="modal-nav">
            <button className="nav-btn prev" onClick={goToPrevious}>⬅️</button>
            <span className="nav-title">{currentTitle}</span>
            <button className="nav-btn next" onClick={goToNext}>➡️</button>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 NEW TASK MODAL - ADMIN ONLY
  return (
    <>
      {/* BACKGROUND CONTENT */}
      <div className="dashboard-wrapper" style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
        {/* Navbar and grid content here - blurred */}
        <div className="maintenance-page">
          <div className="maintenance-header">
            <h1>❌ Not Active Maintenance</h1>
          </div>
        </div>
      </div>

      {/* 🔥 NEW TASK MODAL OVERLAY */}
      <div className="new-task-modal-overlay" onClick={closeNewTaskModal}>
        <div className="new-task-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>➕ Add New Maintenance Task</h2>
            <button className="modal-close" onClick={closeNewTaskModal}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="task-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input type="text" placeholder="Ex: Lift Repair" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select>
                  <option>Wall Repair</option>
                  <option>Electrical</option>
                  <option>Cleaning</option>
                  <option>Pipe Maintenance</option>
                  <option>Gate Repair</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" placeholder="Task details..."></textarea>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="action-btn secondary" onClick={closeNewTaskModal}>
              Cancel
            </button>
            <button className="action-btn primary" onClick={handleNewTaskSubmit}>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotActive;
