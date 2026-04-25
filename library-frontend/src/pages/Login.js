// ═══════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
// TEACHING POINTS:
//   - "Controlled Components": React state drives input values, not the DOM
//   - handleChange uses [e.target.name] — computed property key
//   - try/catch around API call to handle backend errors gracefully
//   - Loading state disables button to prevent double-submit

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userData = await login(form.email, form.password);
      toast.toast("Welcome back, " + userData.fullName + "!");
      navigate(userData.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <Icons.book size={44} />
            <h1>Welcome Back</h1>
            <p>Sign in to reserve your study spot and manage your library bookings.</p>
          </div>
          <div className="auth-hero-pattern" />
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to continue</p>
            {error && <div className="form-error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Icons.mail size={13} /> Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@university.edu" required />
              </div>
              <div className="form-group">
                <label><Icons.lock size={13} /> Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" required />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <><Icons.loader size={16} /> Signing in...</> : <>Sign In <Icons.arrow size={16} /></>}
              </button>
            </form>
            <p className="auth-switch">Don't have an account? <a onClick={() => navigate("/register")}>Create one</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
