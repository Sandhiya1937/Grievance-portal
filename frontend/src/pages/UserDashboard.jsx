import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./UserDashboard.css";

function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editForm, setEditForm] = useState({ id: null, title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Fetch complaints
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      setError("Failed to load complaints");
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Create complaint
  const createComplaint = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill in both fields");
      return;
    }
    
    try {
      await axiosInstance.post("/api/complaints", form);
      setForm({ title: "", description: "" });
      setShowCreateModal(false);
      setSuccess("Complaint created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchComplaints();
    } catch (err) {
      alert("Failed to create complaint");
    }
  };

  // Update complaint
  const updateComplaint = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      alert("Please fill in both fields");
      return;
    }
    
    try {
      await axiosInstance.put(`/api/complaints/${editForm.id}`, {
        title: editForm.title,
        description: editForm.description
      });
      setShowEditModal(false);
      setSuccess("Complaint updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchComplaints();
    } catch (err) {
      alert("Failed to update complaint");
    }
  };

  // Delete complaint
  const deleteComplaint = async () => {
    try {
      await axiosInstance.delete(`/api/complaints/${complaintToDelete}`);
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      setSuccess("Complaint deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchComplaints();
    } catch (err) {
      alert("Failed to delete complaint");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Open edit modal
  const handleEditClick = (complaint) => {
    setEditForm({
      id: complaint._id,
      title: complaint.title,
      description: complaint.description
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const handleDeleteClick = (complaintId) => {
    setComplaintToDelete(complaintId);
    setShowDeleteModal(true);
  };

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
      case "in-progress":
        return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" };
      case "resolved":
        return { bg: "#dcfce7", text: "#166534", border: "#22c55e" };
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
    }
  };

  // Filter complaints
  const filteredComplaints = filterStatus === "all" 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  if (loading) {
    return (
      <div className="user-dashboard-loading">
        <div className="loading-content">
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we fetch your complaints.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome to Your Dashboard</h1>
          <p>Manage your complaints and track their status</p>
        </div>
        <div className="header-actions">
          <div className="user-pill">User</div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            New Complaint
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card stat-total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="card stat-card stat-resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="card stat-card stat-inprogress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="card stat-card stat-pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="card">
        <div className="filter-row">
          <h2 className="section-title">Your Complaints</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>
              {filterStatus === "all"
                ? "No complaints yet"
                : `No "${filterStatus}" complaints`}
            </h3>
            <p>
              {filterStatus === "all"
                ? "Click 'New Complaint' to create your first one."
                : "Try changing the status filter or create a new complaint."}
            </p>
          </div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map(complaint => {
              const s = getStatusColor(complaint.status);
              return (
                <div key={complaint._id} className="complaint-card">
                  <div className="complaint-header">
                    <h4>{complaint.title}</h4>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: s.bg,
                        color: s.text,
                        borderColor: s.border
                      }}
                    >
                      {complaint.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Admin Reply Section */}
                  {complaint.adminReply && (
                    <div className="admin-reply-section">
                      <div className="admin-reply-header">
                        <div className="admin-reply-author">Admin Response</div>
                        <div className="admin-reply-date">
                          {complaint.resolvedAt 
                            ? new Date(complaint.resolvedAt).toLocaleDateString() 
                            : new Date(complaint.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="admin-reply-content">{complaint.adminReply}</div>
                    </div>
                  )}

                  <p className="complaint-description">{complaint.description}</p>
                  <div className="complaint-meta">
                    Created on {new Date(complaint.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* ✨ CHIP-STYLE BUTTONS */}
                  <div className="complaint-actions">
                    <button
                      className="btn-chip btn-chip-edit"
                      onClick={() => handleEditClick(complaint)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="btn-chip btn-chip-delete"
                      onClick={() => handleDeleteClick(complaint._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create new complaint</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter complaint title"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Describe your complaint in detail"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={createComplaint}
              >
                Submit Complaint
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit complaint</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editForm.title}
                onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={5}
                value={editForm.description}
                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={updateComplaint}
              >
                Update Complaint
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete complaint</h3>
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <p className="delete-confirm-text">
                Are you sure you want to delete this complaint?
              </p>
              <p className="delete-warning-text">
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={deleteComplaint}
              >
                Yes, delete
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="footer-note">
        Need help? Contact support at support@complaintsystem.com
      </div>
    </div>
  );
}

export default UserDashboard;