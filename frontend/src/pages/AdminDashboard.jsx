import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyModal, setReplyModal] = useState({ show: false, complaint: null });
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();

  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/admin/complaints");
      setComplaints(res.data);
    } catch {
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  const updateStatus = async (id, status) => {
    if (status === "resolved") {
      // Show reply modal instead of direct update
      const complaint = complaints.find(c => c._id === id);
      setReplyModal({ show: true, complaint });
      return;
    }

    try {
      await axiosInstance.put(`/api/admin/complaints/${id}`, { status });
      setComplaints(prev =>
        prev.map(c => (c._id === id ? { ...c, status } : c))
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const submitReply = async () => {
    try {
      if (!replyText.trim()) {
        alert("Please provide a reply");
        return;
      }

      await axiosInstance.put(`/api/admin/complaints/${replyModal.complaint._id}`, {
        status: "resolved",
        adminReply: replyText
      });

      setComplaints(prev =>
        prev.map(c =>
          c._id === replyModal.complaint._id
            ? { ...c, status: "resolved", adminReply: replyText, resolvedAt: new Date() }
            : c
        )
      );

      setReplyModal({ show: false, complaint: null });
      setReplyText("");
    } catch (error) {
      alert("Failed to submit reply");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredComplaints = complaints.filter(c => {
    const text =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === "all" || c.status === filterStatus;
    return text && statusMatch;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    progress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    users: new Set(complaints.map(c => c.createdBy?._id)).size
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="card dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="subtitle">Manage college complaints efficiently</p>
        </div>

        <div className="header-actions">
          <div className="user-badge">
            <div className="avatar">A</div>
            Administrator
          </div>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card stat-total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="card stat-card stat-pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="card stat-card stat-inprogress">
          <div className="stat-number">{stats.progress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="card stat-card stat-resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="card stat-card stat-users">
          <div className="stat-number">{stats.users}</div>
          <div className="stat-label">Students</div>
        </div>
      </div>

      {/* Controls + Table */}
      <div className="card">
        <div className="search-filter-row">
          <h2 className="section-title">All Complaints</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              className="search-input"
              placeholder="Search by title or student name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Student</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => (
                <tr key={c._id}>
                  <td>#{c._id.slice(0, 6)}</td>
                  <td>{c.title}</td>
                  <td>
                    <div className="user-info">
                      <div className="avatar">{c.createdBy?.name?.[0]}</div>
                      <div>
                        <strong>{c.createdBy?.name}</strong>
                        <div className="email">{c.createdBy?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status ${c.status}`}>
                      {c.status.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="status-select"
                      value={c.status}
                      onChange={e => updateStatus(c._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolve (Requires Reply)</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Reply Modal */}
      {replyModal.show && (
        <div className="modal-overlay" onClick={() => setReplyModal({ show: false, complaint: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Resolve Complaint</h3>
              <button
                className="close-btn"
                onClick={() => setReplyModal({ show: false, complaint: null })}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Complaint Details</label>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <strong>{replyModal.complaint?.title}</strong>
                <p style={{ margin: '0.5rem 0 0', color: '#6b7280' }}>
                  {replyModal.complaint?.description}
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  By {replyModal.complaint?.createdBy?.name} on {new Date(replyModal.complaint?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                rows={6}
                placeholder="Provide a detailed resolution for this complaint..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {replyText.length}/500 characters
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={submitReply}
                disabled={!replyText.trim()}
              >
                Resolve & Send Reply
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setReplyModal({ show: false, complaint: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        © 2026 Grievance Portal
      </footer>
    </div>
  );
}

export default AdminDashboard;
