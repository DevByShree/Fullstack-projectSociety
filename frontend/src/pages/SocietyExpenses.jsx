// pages/SocietyExpenses.jsx - FIXED VERSION (Key Error + Delete Ready)
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/societyexp.css";

function SocietyExpenses() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";
  const token = localStorage.getItem("token");
  
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "Utilities",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/expenses';

  // Fetch expenses from backend API
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Calculate totals by category
  const getCategoryTotals = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  const categoryTotals = getCategoryTotals();
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // ADMIN ONLY: Add new expense
  const handleAddExpense = useCallback(async () => {
    if (newExpense.name.trim() && newExpense.amount && !isNaN(newExpense.amount)) {
      try {
        await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...newExpense,
            amount: parseFloat(newExpense.amount)
          })
        });
        setNewExpense({
          name: "", amount: "", category: "Utilities", description: "", 
          date: new Date().toISOString().split('T')[0]
        });
        setShowAddExpense(false);
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  }, [newExpense, token, fetchExpenses]);

  // ADMIN ONLY: Edit expense
  const handleEditExpense = useCallback((expense) => {
    setEditingExpense(expense);
    setNewExpense({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || "",
      date: expense.date
    });
    setShowEditModal(true);
  }, []);

  // ADMIN ONLY: Save edited expense
  const handleSaveEdit = useCallback(async () => {
    if (newExpense.name.trim() && newExpense.amount && !isNaN(newExpense.amount)) {
      try {
        await fetch(`${API_BASE_URL}/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...newExpense,
            amount: parseFloat(newExpense.amount)
          })
        });
        setShowEditModal(false);
        setEditingExpense(null);
        setNewExpense({
          name: "", amount: "", category: "Utilities", description: "", 
          date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  }, [newExpense, editingExpense, token, fetchExpenses]);

  // ADMIN ONLY: Delete expense - SABKE LIYE DELETE HOGA
  const handleDeleteExpense = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        console.log('🗑️ Deleting ID:', id); // Debug
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          alert('✅ Bill deleted successfully!');
          fetchExpenses(); // Refresh list - sabko dikhega
        } else {
          const errorData = await response.json();
          console.error('Delete response:', response.status, errorData);
          alert(`❌ Delete failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Delete Error:', err);
        alert('❌ Network error - Check backend server');
      }
    }
  }, [token, fetchExpenses]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const categoryColors = {
    Utilities: '#10b981',
    Maintenance: '#f59e0b',
    Staff: '#ef4444',
    Repairs: '#8b5cf6'
  };

  const categories = ["Utilities", "Maintenance", "Staff", "Repairs"];

  // Update Clear All button for admin
  const handleClearAll = useCallback(async () => {
    if (window.confirm("Clear all bills?")) {
      try {
        await fetch(API_BASE_URL, { method: 'DELETE' });
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  }, [fetchExpenses]);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">Loading bills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <h3>🏠 Mohit Residency - Bill Management</h3>
          {isAdmin && <span className="admin-badge">ADMIN</span>}
        </div>
        <div className="nav-right">
          <Link to="/notifications" className="notification-btn" title="Notifications">
            <div className="notification-icon">🔔</div>
            {notificationCount > 0 && <div className="notification-badge">{notificationCount}</div>}
          </Link>
          <div className="profile-container" onClick={() => setProfileMenu(!profileMenu)}>
            <div className="profile-avatar">
              {isAdmin ? "A" : "m"}
            </div>
            <div className="profile-info">
              <div className="profile-name">{isAdmin ? "Administrator" : "Resident Member"}</div>
              <div className="profile-role">{role?.toUpperCase()}</div>
            </div>
            <i className="profile-arrow">▼</i>
            {profileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">👤 Profile</Link>
                {/* {isAdmin && <Link to="/reports" className="dropdown-item">📊 Reports</Link>} */}
                <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="maintenance-page">
        <div className="maintenance-header">
          <div>
            <h1>💰 Society Bills Dashboard</h1>
            <p>February 2026 | {expenses.length} bills recorded {isAdmin && '| 👑 Admin Mode'}</p>
          </div>
          {isAdmin && (
            <div className="admin-actions">
              <button 
                className="add-task-btn" 
                onClick={() => setShowAddExpense(true)}
                title="Add new bill"
              >
                ➕ Add New Bill
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            ⚠️ {error} <button onClick={fetchExpenses}>Retry</button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="expense-summary-grid">
          <div className="summary-card primary">
            <div className="summary-icon">📊</div>
            <div>
              <h3>Total Bill Amount</h3>
              <div className="summary-value">₹{totalAmount.toLocaleString()}</div>
            </div>
          </div>
          <div className="summary-card secondary">
            <div className="summary-icon">📈</div>
            <div>
              <h3>Total Bills</h3>
              <div className="summary-value">{expenses.length}</div>
            </div>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN - ✅ KEY ERROR FIXED */}
        <div className="expense-stats-grid">
          {Object.entries(categoryTotals).map(([category, amount], index) => (
            <div 
              key={`${category}-${index}`} 
              className={`stat-card ${category.toLowerCase().replace(/\s+/g, '-')}`} 
              style={{ '--category-color': categoryColors[category] }}
            >
              <div className="stat-icon" style={{ backgroundColor: categoryColors[category] }}>●</div>
              <div className="stat-number">₹{amount.toLocaleString()}</div>
              <div className="stat-label">{category}</div>
              <div className="stat-progress">
                <div 
                  className="stat-progress-bar" 
                  style={{ width: `${totalAmount ? (amount / totalAmount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ADD BILL MODAL */}
        {isAdmin && showAddExpense && (
          <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>➕ Add New Bill</h3>
              <p className="modal-subtitle">Enter bill details manually</p>
              
              <div className="form-group">
                <label>Bill Name <span className="required">*</span></label>
                <input 
                  type="text"
                  placeholder="Electricity Bill, Water Bill, etc."
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  className="form-input"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Amount <span className="required">*</span></label>
                <input 
                  type="number"
                  placeholder="5000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="form-input"
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  placeholder="Additional details about this bill..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="form-input"
                  rows="3"
                  maxLength={500}
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-primary" 
                  onClick={handleAddExpense}
                  disabled={!newExpense.name.trim() || !newExpense.amount || isNaN(newExpense.amount)}
                >
                  💰 Add Bill
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowAddExpense(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT BILL MODAL */}
        {isAdmin && showEditModal && editingExpense && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>✏️ Edit Bill</h3>
              <p className="modal-subtitle">Update bill details</p>
              
              <div className="form-group">
                <label>Bill Name <span className="required">*</span></label>
                <input 
                  type="text"
                  placeholder="Electricity Bill, Water Bill, etc."
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  className="form-input"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Amount <span className="required">*</span></label>
                <input 
                  type="number"
                  placeholder="5000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="form-input"
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  placeholder="Additional details about this bill..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="form-input"
                  rows="3"
                  maxLength={500}
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-primary" 
                  onClick={handleSaveEdit}
                  disabled={!newExpense.name.trim() || !newExpense.amount || isNaN(newExpense.amount)}
                >
                  💾 Update Bill
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BILLS TABLE */}
        <div className="expenses-section">
          <div className="section-header">
            <h3>📋 All Bills</h3>
            <div className="section-actions">
              <button className="btn-small" onClick={() => {
                const dataStr = JSON.stringify(expenses, null, 2);
                navigator.clipboard.writeText(dataStr);
              }}>
                📋 Copy Data
              </button>
              {isAdmin && (
                <button className="btn-small admin-clear" onClick={handleClearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>
          <div className="expenses-table-container">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {isAdmin 
                        ? "🤲 No bills added yet. Click 'Add New Bill' to start!" 
                        : "📋 No bills recorded yet. Contact admin to add bills."
                      }
                    </td>
                  </tr>
                ) : (
                  expenses.slice().reverse().map((expense) => (
                    <tr key={expense.id || expense._id}>
                      <td>{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                      <td>{expense.name}</td>
                      <td>{expense.description || '-'}</td>
                      <td>
                        <span className={`category-tag ${expense.category.toLowerCase().replace(/\s+/g, '-')}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="amount">₹{(expense.amount || 0).toLocaleString()}</td>
                      <td>
                        {isAdmin ? (
                          <div className="action-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditExpense(expense)}
                              title="Edit bill"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteExpense(expense.id || expense._id)}
                              title="Delete bill"
                            >
                              🗑️
                            </button>
                          </div>
                        ) : (
                          <span className="action-readonly">👁️ View Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}><strong>Total Bill Amount</strong></td>
                  <td className="total"><strong>₹{totalAmount.toLocaleString()}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocietyExpenses;
