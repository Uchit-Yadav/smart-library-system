import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icons from "../components/Icons";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <div className="hero-badge">✦ Smart Library System</div>
          <h1>Reserve Your <span className="text-accent">Study Spot</span> in Seconds</h1>
          <p className="hero-desc">No more wandering the library looking for an empty seat. Check availability in real-time, book your preferred spot, and focus on what matters — your studies.</p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <button className="btn-primary btn-lg" onClick={() => navigate("/seats")}><Icons.chair size={18} /> Browse Seats</button>
            ) : (<>
              <button className="btn-primary btn-lg" onClick={() => navigate("/register")}><Icons.arrow size={18} /> Get Started Free</button>
              <button className="btn-ghost btn-lg" onClick={() => navigate("/login")}>Sign In</button>
            </>)}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hc-1"><Icons.chair size={28} /><div><strong>120+</strong><span>Seats Available</span></div></div>
          <div className="hero-card hc-2"><Icons.calendar size={28} /><div><strong>Real-time</strong><span>Booking</span></div></div>
          <div className="hero-card hc-3"><Icons.shield size={28} /><div><strong>Secure</strong><span>JWT Auth</span></div></div>
        </div>
      </div>

      <div className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          {[
            { icon: <Icons.search size={28} />, title: "Search", desc: "Find available seats by floor, section, date, and time slot" },
            { icon: <Icons.chair size={28} />, title: "Reserve", desc: "Book your preferred seat with a single click. Conflict-free guarantee" },
            { icon: <Icons.check size={28} />, title: "Study", desc: "Show up, sit down, and focus. Your seat is secured and waiting" },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-step">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
