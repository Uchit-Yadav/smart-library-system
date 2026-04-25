import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icons from "./Icons";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const nav = (path) => { navigate(path); setMobileOpen(false); };
  const handleLogout = () => { logout(); nav("/login"); };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" onClick={() => nav("/")} href="/">
          <div className="brand-icon">
            <Icons.book size={20} />
          </div>
          <span>SmartLibrary</span>
        </a>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <Icons.x size={22} /> : <Icons.menu size={22} />}
        </button>

        <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          {isAuthenticated ? (<>
            <a className={isActive("/dashboard")} onClick={() => nav("/dashboard")}><Icons.home size={15} /> Dashboard</a>
            <a className={isActive("/seats")} onClick={() => nav("/seats")}><Icons.chair size={15} /> Seats</a>
            <a className={isActive("/bookings")} onClick={() => nav("/bookings")}><Icons.calendar size={15} /> Bookings</a>
            <a className={isActive("/profile")} onClick={() => nav("/profile")}><Icons.user size={15} /> Profile</a>
            {isAdmin && <a className={`${isActive("/admin")} admin-link`} onClick={() => nav("/admin")}><Icons.shield size={15} /> Admin</a>}
            <div className="navbar-user-section">
              <span className="navbar-greeting">{user?.fullName}</span>
              <button onClick={handleLogout} className="btn-logout"><Icons.logout size={15} /> Logout</button>
            </div>
          </>) : (<>
            <a className={isActive("/login")} onClick={() => nav("/login")}>Sign In</a>
            <a className="btn-register-nav" onClick={() => nav("/register")}>Get Started</a>
          </>)}
        </div>
      </div>
    </nav>
  );
}
