import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || "", phone: "", email: user?.email || "" });

  const handleSave = (e) => { e.preventDefault(); toast.toast("Profile updated!"); setEditing(false); };

  return (
    <div className="profile-page fade-in">
      <div className="page-header"><h1>My Profile</h1><p>View and update your account information</p></div>
      <div className="profile-card">
        <div className="profile-avatar">{user?.fullName?.charAt(0) || "U"}</div>
        <div className="profile-info">
          <h2>{user?.fullName}</h2>
          <span className="profile-email">{user?.email}</span>
          <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
      </div>
      <div className="profile-form-card">
        <div className="section-header"><h2>Account Details</h2>{!editing && <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>}</div>
        <form onSubmit={handleSave}>
          <div className="form-group"><label>Full Name</label><input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} disabled={!editing} /></div>
          <div className="form-group"><label>Email</label><input value={form.email} disabled /></div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} disabled={!editing} placeholder="Not set" /></div>
          {editing && (
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
