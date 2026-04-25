// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════
// TEACHING: useEffect for "fetch on mount"
//   Components render first with empty state, THEN useEffect fires the
//   API call. When data arrives, setState triggers re-render with content.
//   This is the standard React data-fetching pattern.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icons from "../components/Icons";
import mockAPI from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, completed: 0 });

  useEffect(() => {
    (async () => {
      try {
        const data = await mockAPI.getMyBookings(user?.id);
        setBookings(data);
        setStats({ total: data.length, confirmed: data.filter(b => b.status === "CONFIRMED").length, cancelled: data.filter(b => b.status === "CANCELLED").length, completed: data.filter(b => b.status === "COMPLETED").length });
      } catch {} finally { setLoading(false); }
    })();
  }, [user]);

  const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  const fmtTime = (t) => { if (!t) return ""; const [h, m] = t.split(":"); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

  if (loading) return <div className="page-loading"><Icons.loader size={30} /><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <div><h1>Welcome, {user?.fullName || "Student"}</h1><p>Manage your library seat reservations</p></div>
        <button className="btn-primary" onClick={() => navigate("/seats")}><Icons.chair size={16} /> Book a Seat</button>
      </div>

      <div className="stats-grid">
        {[
          { icon: <Icons.calendar size={22} />, n: stats.total, label: "Total Bookings", cls: "blue" },
          { icon: <Icons.check size={22} />, n: stats.confirmed, label: "Active", cls: "green" },
          { icon: <Icons.clock size={22} />, n: stats.completed, label: "Completed", cls: "amber" },
          { icon: <Icons.x size={22} />, n: stats.cancelled, label: "Cancelled", cls: "red" },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-info"><span className="stat-number">{s.n}</span><span className="stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header"><h2>Recent Bookings</h2><a className="link-more" onClick={() => navigate("/bookings")}>View all <Icons.arrow size={14} /></a></div>
        {bookings.length === 0 ? (
          <div className="empty-state"><Icons.book size={44} /><h3>No bookings yet</h3><p>Reserve your first seat!</p><button className="btn-primary" onClick={() => navigate("/seats")}>Browse Seats</button></div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="data-table"><thead><tr><th>Seat</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id}><td className="seat-cell"><Icons.chair size={13} /> {b.seatNumber}</td><td>{fmtDate(b.bookingDate)}</td><td>{fmtTime(b.startTime)} – {fmtTime(b.endTime)}</td><td><span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}
