// ═══════════════════════════════════════════════════════════════════════════
// SEATS PAGE — The Core Feature
// ═══════════════════════════════════════════════════════════════════════════
// FLOW: User picks filters → Search → Available seats appear → Click Book →
//       Confirmation modal → POST /api/bookings → Success → Refresh

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";
import mockAPI from "../services/api";

export default function Seats() {
  const { user } = useAuth();
  const toast = useToast();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [filters, setFilters] = useState({ date: "2026-04-16", startTime: "09:00", endTime: "11:00", floor: "", section: "" });

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getAvailableSeats(filters);
      setSeats(data);
    } catch { toast.error("Failed to load seats"); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchSeats(); }, []);

  const handleBook = async () => {
    if (!selectedSeat) return;
    setBookingLoading(true);
    try {
      await mockAPI.createBooking({ seatId: selectedSeat.id, bookingDate: filters.date, startTime: filters.startTime, endTime: filters.endTime }, user.id);
      toast.toast(`Seat ${selectedSeat.seatNumber} booked!`);
      setSelectedSeat(null);
      fetchSeats();
    } catch (err) { toast.error(err?.response?.data?.message || "Booking failed"); } finally { setBookingLoading(false); }
  };

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="seats-page fade-in">
      <div className="page-header"><h1>Find a Seat</h1><p>Search for available library seats and study rooms</p></div>

      <div className="filter-bar">
        <div className="filter-group"><label><Icons.calendar size={13} /> Date</label><input type="date" name="date" value={filters.date} onChange={handleFilter} /></div>
        <div className="filter-group"><label><Icons.clock size={13} /> From</label><input type="time" name="startTime" value={filters.startTime} onChange={handleFilter} /></div>
        <div className="filter-group"><label><Icons.clock size={13} /> To</label><input type="time" name="endTime" value={filters.endTime} onChange={handleFilter} /></div>
        <div className="filter-group"><label><Icons.building size={13} /> Floor</label>
          <select name="floor" value={filters.floor} onChange={handleFilter}><option value="">All</option><option value="1">Floor 1</option><option value="2">Floor 2</option><option value="3">Floor 3</option></select>
        </div>
        <div className="filter-group"><label><Icons.layers size={13} /> Section</label>
          <select name="section" value={filters.section} onChange={handleFilter}><option value="">All</option><option value="General">General</option><option value="Reference">Reference</option><option value="Quiet Zone">Quiet Zone</option><option value="Study Room">Study Room</option></select>
        </div>
        <button className="btn-primary" onClick={fetchSeats}><Icons.search size={15} /> Search</button>
      </div>

      {loading ? <div className="page-loading"><Icons.loader size={30} /><p>Searching...</p></div> :
       seats.length === 0 ? <div className="empty-state"><Icons.chair size={44} /><h3>No seats found</h3><p>Try different filters.</p></div> : (
        <div className="seats-grid">
          {seats.map((seat, i) => (
            <div key={seat.id} className={`seat-card ${!seat.isAvailable ? "seat-booked" : ""}`} style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="seat-card-header">
                <span className="seat-number">{seat.seatNumber}</span>
                <span className={`seat-type-badge ${seat.seatType?.toLowerCase()}`}>{seat.seatType === "STUDY_ROOM" ? "Study Room" : "Individual"}</span>
              </div>
              <div className="seat-card-details">
                <div className="seat-detail"><Icons.building size={13} /><span>Floor {seat.floor}</span></div>
                <div className="seat-detail"><Icons.layers size={13} /><span>{seat.section}</span></div>
                <div className="seat-detail"><Icons.users size={13} /><span>Capacity: {seat.capacity}</span></div>
              </div>
              {seat.isAvailable ? <button className="btn-book" onClick={() => setSelectedSeat(seat)}><Icons.check size={15} /> Book This Seat</button> : <div className="seat-unavailable">Unavailable</div>}
            </div>
          ))}
        </div>
      )}

      {selectedSeat && (
        <div className="modal-overlay" onClick={() => setSelectedSeat(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSeat(null)}><Icons.x size={18} /></button>
            <h2>Confirm Booking</h2>
            <div className="modal-details">
              {[["Seat", selectedSeat.seatNumber], ["Type", selectedSeat.seatType === "STUDY_ROOM" ? "Study Room" : "Individual"], ["Location", `Floor ${selectedSeat.floor} · ${selectedSeat.section}`], ["Date", filters.date], ["Time", `${filters.startTime} – ${filters.endTime}`]].map(([k, v]) => (
                <div className="modal-detail-row" key={k}><span>{k}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedSeat(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleBook} disabled={bookingLoading}>
                {bookingLoading ? <><Icons.loader size={15} /> Booking...</> : <><Icons.check size={15} /> Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
