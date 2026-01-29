import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import {
  FaSignOutAlt, FaUser, FaFilter,
  FaSearch, FaEye,
  FaClock, FaExclamationTriangle, FaCheckCircle,
  FaBell, FaTimes
} from "react-icons/fa";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Wrap fetchAllComplaints in useCallback to prevent unnecessary re-renders
  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/api/admin/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please check your permissions.");
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Add navigate as dependency

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/api/admin/complaints/${id}`, { status });
      
      setComplaints(prev => 
        prev.map(c => c._id === id ? { ...c, status } : c)
      );
      
      // Show success notification
      const complaint = complaints.find(c => c._id === id);
      if (complaint) {
        alert(`Status updated to "${status}" for "${complaint.title}"`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + (err.response?.data?.message || "Please try again"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock style={{ color: "#e53e3e" }} />;
      case "in-progress":
        return <FaExclamationTriangle style={{ color: "#d69e2e" }} />;
      case "resolved":
        return <FaCheckCircle style={{ color: "#38a169" }} />;
      default:
        return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#e53e3e";
      case "in-progress":
        return "#d69e2e";
      case "resolved":
        return "#38a169";
      default:
        return "#718096";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.createdBy?.name && complaint.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (complaint.createdBy?.email && complaint.createdBy.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    users: [...new Set(complaints.map(c => c.createdBy?._id).filter(Boolean))].length
  };

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]); // Add fetchAllComplaints to dependency array

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: "#718096", marginTop: "8px" }}>
            Manage all complaints and user reports
          </p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(56, 161, 105, 0.1)", padding: "10px 20px", borderRadius: "10px" }}>
            <FaUser style={{ color: "#38a169" }} />
            <span style={{ fontWeight: "600", color: "#4a5568" }}>Administrator</span>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: "10px 20px" }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="card" style={{ textAlign: "center", borderTop: "4px solid #667eea" }}>
          <h3 style={{ fontSize: "32px", color: "#667eea", marginBottom: "10px" }}>
            {stats.total}
          </h3>
          <p style={{ color: "#718096" }}>Total Complaints</p>
        </div>
        <div className="card" style={{ textAlign: "center", borderTop: "4px solid #e53e3e" }}>
          <h3 style={{ fontSize: "32px", color: "#e53e3e", marginBottom: "10px" }}>
            {stats.pending}
          </h3>
          <p style={{ color: "#718096" }}>Pending</p>
        </div>
        <div className="card" style={{ textAlign: "center", borderTop: "4px solid #d69e2e" }}>
          <h3 style={{ fontSize: "32px", color: "#d69e2e", marginBottom: "10px" }}>
            {stats.inProgress}
          </h3>
          <p style={{ color: "#718096" }}>In Progress</p>
        </div>
        <div className="card" style={{ textAlign: "center", borderTop: "4px solid #38a169" }}>
          <h3 style={{ fontSize: "32px", color: "#38a169", marginBottom: "10px" }}>
            {stats.resolved}
          </h3>
          <p style={{ color: "#718096" }}>Resolved</p>
        </div>
        <div className="card" style={{ textAlign: "center", borderTop: "4px solid #9f7aea" }}>
          <h3 style={{ fontSize: "32px", color: "#9f7aea", marginBottom: "10px" }}>
            {stats.users}
          </h3>
          <p style={{ color: "#718096" }}>Total Users</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ 
                position: "absolute", 
                left: "15px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "#a0aec0" 
              }} />
              <input
                type="text"
                placeholder="Search complaints by title, description, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "45px" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <FaFilter style={{ color: "#718096" }} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control"
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            fontSize: "14px"
          }}>
            <thead>
              <tr style={{ 
                background: "#f7fafc", 
                textAlign: "left",
                borderBottom: "2px solid #e2e8f0"
              }}>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>Title</th>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>User</th>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>Created</th>
                <th style={{ padding: "15px", color: "#4a5568", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                    <div className="empty-state">
                      <FaBell style={{ fontSize: "48px", color: "#e2e8f0", marginBottom: "20px" }} />
                      <h3>No complaints found</h3>
                      <p>No complaints match your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr 
                    key={complaint._id} 
                    style={{ 
                      borderBottom: "1px solid #e2e8f0",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f7fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <td style={{ padding: "15px", color: "#718096", fontFamily: "monospace" }}>
                      #{complaint._id.substring(0, 6)}
                    </td>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      {complaint.title}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{complaint.createdBy?.name || "Unknown"}</div>
                        <div style={{ fontSize: "12px", color: "#a0aec0" }}>{complaint.createdBy?.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {getStatusIcon(complaint.status)}
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "12px", 
                          fontWeight: "600",
                          background: getStatusColor(complaint.status) + "20",
                          color: getStatusColor(complaint.status)
                        }}>
                          {complaint.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "15px", color: "#718096" }}>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          onClick={() => handleViewDetails(complaint)}
                          className="btn btn-outline"
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                        >
                          <FaEye /> View
                        </button>
                        <select
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint._id, e.target.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            background: "white",
                            cursor: "pointer",
                            fontSize: "13px",
                            minWidth: "120px"
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginTop: "25px", 
          paddingTop: "20px", 
          borderTop: "1px solid #e2e8f0" 
        }}>
          <div style={{ color: "#718096", fontSize: "14px" }}>
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-outline" style={{ padding: "8px 16px" }}>
              Previous
            </button>
            <button className="btn btn-outline" style={{ padding: "8px 16px" }}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Complaint Details Modal */}
      {showDetailsModal && selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Complaint Details</h3>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                marginBottom: "20px",
                padding: "15px",
                background: "#f7fafc",
                borderRadius: "10px"
              }}>
                {getStatusIcon(selectedComplaint.status)}
                <div>
                  <h4 style={{ margin: "0", color: "#2d3748" }}>{selectedComplaint.title}</h4>
                  <p style={{ margin: "5px 0 0 0", color: "#718096", fontSize: "14px" }}>
                    Created on {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <div style={{ 
                  padding: "15px", 
                  background: "#f8fafc", 
                  borderRadius: "8px",
                  lineHeight: "1.6"
                }}>
                  {selectedComplaint.description}
                </div>
              </div>

              <div className="form-group">
                <label>User Information</label>
                <div style={{ 
                  padding: "15px", 
                  background: "#f8fafc", 
                  borderRadius: "8px" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "50%", 
                      background: "#667eea",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600"
                    }}>
                      {selectedComplaint.createdBy?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#2d3748" }}>
                        {selectedComplaint.createdBy?.name || "Unknown User"}
                      </div>
                      <div style={{ color: "#667eea", fontSize: "14px" }}>
                        {selectedComplaint.createdBy?.email || "No email"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Update Status</label>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => {
                    updateStatus(selectedComplaint._id, e.target.value);
                    setSelectedComplaint({...selectedComplaint, status: e.target.value});
                  }}
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "40px", 
        padding: "20px",
        color: "#a0aec0", 
        fontSize: "14px",
        borderTop: "1px solid #e2e8f0"
      }}>
        <p>© 2024 Complaint Management System | Admin Panel v1.0</p>
      </div>
    </div>
  );
}

export default AdminDashboard;