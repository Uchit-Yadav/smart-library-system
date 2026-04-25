// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════
// Only accessible if user.role === "ADMIN"
// Has 4 tabs: Dashboard, Users, Seats, Bookings

import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";
import mockAPI from "../services/api";

export default function Admin() {
  const toast = useToast();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSeat, setShowAddSeat] = useState(false);
  const [seatForm, setSeatForm] = useState({ seatNumber: "", floor: 1, section: "General", seatType: "INDIVIDUAL", capacity: 1 });

  useEffect(() => {
    (async () => {
      try {
        const [s, u, st, b] = await Promise.all([mockAPI.getDashboardStats(), mockAPI.getAllUsers(), mockAPI.getAllSeats(), mockAPI.getAllBookings()]);
        setStats(s); setUsers(u); setSeats(st); setBookings(b);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const reload = async () => {
    const [s, u, st, b] = await Promise.all([mockAPI.getDashboardStats(), mockAPI.getAllUsers(), mockAPI.getAllSeats(), mockAPI.getAllBookings()]);
    setStats(s); setUsers(u); setSeats(st); setBookings(b);
  };

  const handleDeleteUser = async (id) => { if (!window.confirm("Delete this user?")) return; await mockAPI.deleteUser(id); toast.toast("User deleted"); reload(); };
  const handleCancelBooking = async (id) => { await mockAPI.cancelBooking(id); toast.toast("Booking cancelled"); reload(); };
  const handleDeleteSeat = async (id) => { if (!window.confirm("Delete this seat?")) return; await mockAPI.deleteSeat(id); toast.toast("Seat deleted"); reload(); };
  const handleAddSeat = async (e) => { e.preventDefault(); await mockAPI.createSeat(seatForm); toast.toast("Seat added!"); setShowAddSeat(false); setSeatForm({ seatNumber: "", floor: 1, section: "General", seatType: "INDIVIDUAL", capacity: 1 }); reload(); };

  const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

  if (loading) return <div className="page-loading"><Icons.loader size={30} /><p>Loading admin panel...</p></div>;

  return (
    <div className="admin-page fade-in">
      <div className="page-header"><h1><Icons.shield size={24} /> Admin Panel</h1><p>Manage seats, users, and bookings</p></div>

      <div className="admin-tabs">
        {[["dashboard","Dashboard"],["users","Users"],["seats","Seats"],["bookings","Bookings"]].map(([k,v]) => (
          <button key={k} className={`admin-tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {tab === "dashboard" && stats && (
        <div className="admin-dashboard">
          <div className="stats-grid">
            {[
              { icon: <Icons.users size={22} />, n: stats.totalUsers, label: "Users", cls: "blue" },
              { icon: <Icons.chair size={22} />, n: stats.totalSeats, label: "Total Seats", cls: "green" },
              { icon: <Icons.calendar size={22} />, n: stats.totalBookings, label: "Bookings", cls: "amber" },
              { icon: <Icons.check size={22} />, n: stats.activeBookings, label: "Active", cls: "red" },
            ].map((s, i) => (
              <div className="stat-card" key={i}><div className={`stat-icon ${s.cls}`}>{s.icon}</div><div className="stat-info"><span className="stat-number">{s.n}</span><span className="stat-label">{s.label}</span></div></div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-section">
          <div className="bookings-table-wrapper">
            <table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead><tbody>
              {users.map(u => (
                <tr key={u.id}><td>{u.fullName}</td><td>{u.email}</td><td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td><td>{u.createdAt}</td><td>{u.role !== "ADMIN" && <button className="btn-icon-danger" onClick={() => handleDeleteUser(u.id)}><Icons.trash size={14} /></button>}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {tab === "seats" && (
        <div className="admin-section">
          <div className="section-header"><h2>All Seats ({seats.length})</h2><button className="btn-primary" onClick={() => setShowAddSeat(!showAddSeat)}><Icons.plus size={15} /> Add Seat</button></div>
          {showAddSeat && (
            <form className="add-seat-form" onSubmit={handleAddSeat}>
              <input placeholder="Seat Number (e.g. A-201)" value={seatForm.seatNumber} onChange={e => setSeatForm({...seatForm, seatNumber: e.target.value})} required />
              <select value={seatForm.floor} onChange={e => setSeatForm({...seatForm, floor: parseInt(e.target.value)})}><option value={1}>Floor 1</option><option value={2}>Floor 2</option><option value={3}>Floor 3</option></select>
              <select value={seatForm.section} onChange={e => setSeatForm({...seatForm, section: e.target.value})}><option>General</option><option>Reference</option><option>Quiet Zone</option><option>Study Room</option></select>
              <select value={seatForm.seatType} onChange={e => setSeatForm({...seatForm, seatType: e.target.value})}><option value="INDIVIDUAL">Individual</option><option value="STUDY_ROOM">Study Room</option></select>
              <input type="number" min={1} max={12} value={seatForm.capacity} onChange={e => setSeatForm({...seatForm, capacity: parseInt(e.target.value)})} />
              <button type="submit" className="btn-primary">Add</button>
            </form>
          )}
          <div className="bookings-table-wrapper">
            <table className="data-table"><thead><tr><th>Seat</th><th>Floor</th><th>Section</th><th>Type</th><th>Cap.</th><th>Status</th><th></th></tr></thead><tbody>
              {seats.map(s => (
                <tr key={s.id}><td>{s.seatNumber}</td><td>{s.floor}</td><td>{s.section}</td><td>{s.seatType}</td><td>{s.capacity}</td><td>{s.isAvailable ? <span className="status-badge status-confirmed">Available</span> : <span className="status-badge status-cancelled">Booked</span>}</td><td><button className="btn-icon-danger" onClick={() => handleDeleteSeat(s.id)}><Icons.trash size={14} /></button></td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="admin-section">
          <div className="bookings-table-wrapper">
            <table className="data-table"><thead><tr><th>User</th><th>Seat</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>
              {bookings.map(b => (
                <tr key={b.id}><td>{b.userName}</td><td>{b.seatNumber}</td><td>{fmtDate(b.bookingDate)}</td><td><span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span></td><td>{b.status === "CONFIRMED" && <button className="btn-cancel-sm" onClick={() => handleCancelBooking(b.id)}>Cancel</button>}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}
    </div>
  );
}
