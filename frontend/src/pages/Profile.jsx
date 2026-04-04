import { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [pwMode, setPwMode] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        // Store for navbar avatar
        localStorage.setItem("userName", res.data.name);
        localStorage.setItem("userEmail", res.data.email);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = async () => {
    if (!name.trim()) return alert("Name cannot be empty");
    setSaving(true);
    try {
      const { data } = await API.put("/auth/profile", { name });
      setUser(data.user);
      localStorage.setItem("userName", data.user.name);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return alert("Passwords do not match");
    if (passwords.newPass.length < 6) return alert("Password must be at least 6 characters");
    setPwLoading(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      alert("Password changed successfully!");
      setPwMode(false);
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!user) return <div className="profile-loading">User not found</div>;

  const avatarLetter = user.name?.charAt(0).toUpperCase() || "U";
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-grid">
        {/* LEFT — Avatar + Info */}
        <div className="profile-card profile-left">
          <div className="profile-big-avatar">{avatarLetter}</div>
          <h2 className="profile-user-name">{user.name}</h2>
          <p className="profile-user-email">{user.email}</p>
          <span className="profile-role-badge">{user.role}</span>
          <p className="profile-joined">Member since {joinedDate}</p>
        </div>

        {/* RIGHT — Edit sections */}
        <div className="profile-right">

          {/* Edit Name */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
              {!editMode && (
                <button className="profile-edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Edit
                </button>
              )}
            </div>

            <div className="profile-field">
              <label>Full Name</label>
              {editMode ? (
                <div className="profile-edit-row">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="profile-input"
                    placeholder="Enter your name"
                  />
                  <button
                    className="profile-save-btn"
                    onClick={handleSaveName}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="profile-cancel-btn"
                    onClick={() => { setEditMode(false); setName(user.name); }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="profile-value">{user.name}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <p className="profile-value">{user.email}
                <span className="email-lock">🔒 Cannot be changed</span>
              </p>
            </div>
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Password & Security</h3>
              {!pwMode && (
                <button className="profile-edit-btn" onClick={() => setPwMode(true)}>
                  🔑 Change
                </button>
              )}
            </div>

            {pwMode ? (
              <form onSubmit={handleChangePassword} className="pw-form">
                <div className="profile-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="profile-input"
                    placeholder="Enter current password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="profile-input"
                    placeholder="Min 6 characters"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="profile-input"
                    placeholder="Re-enter new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-edit-row">
                  <button type="submit" className="profile-save-btn" disabled={pwLoading}>
                    {pwLoading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={() => { setPwMode(false); setPasswords({ current: "", newPass: "", confirm: "" }); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="profile-value">••••••••</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
