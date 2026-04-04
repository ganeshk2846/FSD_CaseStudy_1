import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/admin/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  const fetchUsers = () => {
    setLoading(true);
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await API.put(`/admin/users/${user._id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users">
      <div className="au-header">
        <input
          className="au-search"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="au-count">{users.length} total users</span>
      </div>

      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : (
        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className={u._id === currentUserId ? "current-user-row" : ""}>
                  <td className="au-name">
                    <div className="user-avatar">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                    {u._id === currentUserId && <span className="you-badge">You</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="au-actions">
                    {u._id !== currentUserId && (
                      <>
                        <button
                          className={`btn-role ${u.role === "admin" ? "demote" : "promote"}`}
                          onClick={() => handleRoleToggle(u)}
                        >
                          {u.role === "admin" ? "→ User" : "→ Admin"}
                        </button>
                        <button className="btn-delete" onClick={() => setDeleteId(u._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="empty-msg">No users found</p>}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete User?</h3>
            <p>This will permanently remove the user account.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
