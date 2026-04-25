import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";
import mockAPI from "../services/api";

export default function Bookings() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { (async () => { try { setBookings(await mockAPI.getMyBookings(user?.id)); } catch {} finally { setLoading(false); } })(); }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancellingId(id);
    try { await mockAPI.cancelBooking(id); toast.toast("Booking cancelled"); setBookings(await mockAPI.getMyBookings(user?.id)); } catch (err) { toast.error("Failed to cancel"); } finally { setCancellingId(null); }
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
  const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "";
  const fmtTime = (t) => { if (!t) return ""; const [h, m] = t.split(":"); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

  if (loading) return <div className="page-loading"><Icons.loader size={30} /><p>Loading bookings...</p></div>;

  return (
    <div className="bookings-page fade-in">
      <div className="page-header"><h1>My Bookings</h1><p>View and manage your reservations</p></div>
      <div className="filter-pills">
        {["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
          <button key={s} className={`pill ${filter === s ? "pill-active" : ""}`} onClick={() => setFilter(s)}>{s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()} ({s === "ALL" ? bookings.length : bookings.filter(b => b.status === s).length})</button>
        ))}
      </div>
      {filtered.length === 0 ? <div className="empty-state"><Icons.calendar size={44} /><h3>No bookings found</h3><p>No {filter.toLowerCase()} bookings to show.</p></div> : (
        <div className="bookings-list">
          {filtered.map((b, i) => (
            <div key={b.id} className="booking-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="booking-card-left">
                <div className="booking-seat-tag"><Icons.chair size={16} /> {b.seatNumber}</div>
                <div className="booking-meta"><span><Icons.building size={13} /> Floor {b.floor} · {b.section}</span></div>
              </div>
              <div className="booking-card-center">
                <span className="booking-date">{fmtDate(b.bookingDate)}</span>
                <span className="booking-time">{fmtTime(b.startTime)} – {fmtTime(b.endTime)}</span>
              </div>
              <div className="booking-card-right">
                <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                {b.status === "CONFIRMED" && (
                  <button className="btn-cancel-sm" onClick={() => handleCancel(b.id)} disabled={cancellingId === b.id}>
                    {cancellingId === b.id ? <Icons.loader size={13} /> : <Icons.x size={13} />} Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
