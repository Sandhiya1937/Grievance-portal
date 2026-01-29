import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, 
  FaExclamationTriangle, FaFilter
} from "react-icons/fa"; // Removed unused FaClock and FaCheckCircle

function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editForm, setEditForm] = useState({ title: "", description: "", id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Wrap fetchComplaints in useCallback
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. " + (err.response?.data?.message || "Please try again."));
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const createComplaint = async () => {
    try {
      if (!form.title.trim()) {
        alert("Please enter a title");
        return;
      }
      
      if (!form.description.trim()) {
        alert("Please enter a description");
        return;
      }
      
      await axiosInstance.post("/api/complaints", form);
      
      setForm({ title: "", description: "" });
      setShowCreateModal(false);
      setSuccess("Complaint submitted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
      fetchComplaints();
    } catch (err) {
      console.error("Error creating complaint:", err);
      alert("Failed to create complaint: " + (err.response?.data?.message || "Please try again"));
    }
  };

  const updateComplaint = async () => {
    try {
      if (!editForm.title.trim() || !editForm.description.trim()) {
        alert("Please fill in both title and description");
        return;
      }
      
      await axiosInstance.put(`/api/complaints/${editForm.id}`, {
        title: editForm.title,
        description: editForm.description
      });
      
      setShowEditModal(false);
      setSuccess("Complaint updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchComplaints();
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Failed to update complaint: " + (err.response?.data?.message || "Please try again"));
    }
  };

  const deleteComplaint = async () => {
    try {
      await axiosInstance.delete(`/api/complaints/${complaintToDelete}`);
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      setSuccess("Complaint deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Failed to delete complaint: " + (err.response?.data?.message || "Please try again"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditClick = (complaint) => {
    setEditForm({
      id: complaint._id,
      title: complaint.title,
      description: complaint.description
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (complaintId) => {
    setComplaintToDelete(complaintId);
    setShowDeleteModal(true);
  };

  // Helper function to get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in-progress":
        return "status-in-progress";
      case "resolved":
        return "status-resolved";
      default:
        return "status-pending";
    }
  };

  const filteredComplaints = filterStatus === "all" 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  useEffect(() => {
    fetchComplaints();
    
    // Check if user is admin (shouldn't be here)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload.role === "admin") {
          console.log("Admin detected in user dashboard, redirecting...");
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    }
  }, [fetchComplaints, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we fetch your complaints.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome to Your Dashboard</h1>
          <p style={{ color: "#718096", marginTop: "8px" }}>
            Manage your complaints and track their status
          </p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(102, 126, 234, 0.1)", padding: "10px 20px", borderRadius: "10px" }}>
            <span style={{ fontWeight: "600", color: "#4a5568" }}>User</span>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <FaPlus /> New Complaint
          </button>
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: "10px 20px" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <FaTimes /> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <FaCheck /> {success}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "36px", color: "#667eea", marginBottom: "10px" }}>
            {complaints.length}
          </h3>
          <p style={{ color: "#718096" }}>Total Complaints</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "36px", color: "#48bb78", marginBottom: "10px" }}>
            {complaints.filter(c => c.status === "resolved").length}
          </h3>
          <p style={{ color: "#718096" }}>Resolved</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "36px", color: "#ed8936", marginBottom: "10px" }}>
            {complaints.filter(c => c.status === "in-progress").length}
          </h3>
          <p style={{ color: "#718096" }}>In Progress</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "36px", color: "#f56565", marginBottom: "10px" }}>
            {complaints.filter(c => c.status === "pending").length}
          </h3>
          <p style={{ color: "#718096" }}>Pending</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2>Your Complaints</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <FaFilter style={{ color: "#718096" }} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control"
              style={{ width: "auto", padding: "8px 16px" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "60px", color: "#e2e8f0", marginBottom: "20px" }}>
              📋
            </div>
            <h3>No complaints found</h3>
            <p>
              {filterStatus === "all" 
                ? "You haven't created any complaints yet. Click 'New Complaint' to get started."
                : `No complaints with status "${filterStatus}" found.`
              }
            </p>
            {filterStatus !== "all" && (
              <button 
                onClick={() => setFilterStatus("all")}
                className="btn btn-primary"
                style={{ marginTop: "20px" }}
              >
                View All Complaints
              </button>
            )}
          </div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h4>{complaint.title}</h4>
                  <div className={`status-badge ${getStatusColorClass(complaint.status)}`}>
                    <span style={{ marginLeft: "6px" }}>{complaint.status}</span>
                  </div>
                </div>
                <p>{complaint.description}</p>
                
                <div className="complaint-meta">
                  <div className="date">
                    Created: {new Date(complaint.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    onClick={() => handleEditClick(complaint)}
                    className="btn btn-warning"
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(complaint._id)}
                    className="btn btn-danger"
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Complaint</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter complaint title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                placeholder="Describe your complaint in detail"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="5"
              />
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
              <button 
                onClick={createComplaint}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <FaPlus /> Submit Complaint
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Complaint Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Complaint</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows="5"
              />
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
              <button 
                onClick={updateComplaint}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <FaCheck /> Update Complaint
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: "60px", color: "#f56565", marginBottom: "20px" }}>
                <FaExclamationTriangle />
              </div>
              <h4 style={{ marginBottom: "15px", color: "#2d3748" }}>
                Are you sure you want to delete this complaint?
              </h4>
              <p style={{ color: "#718096" }}>
                This action cannot be undone. The complaint will be permanently deleted.
              </p>
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button 
                onClick={deleteComplaint}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                <FaTrash /> Yes, Delete
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div style={{ textAlign: "center", marginTop: "40px", color: "#a0aec0", fontSize: "14px" }}>
        <p>Need help? Contact support at support@complaintsystem.com</p>
      </div>
    </div>
  );
}

export default UserDashboard;