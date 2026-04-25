import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icons from "../components/Icons";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: "" }); };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password, phoneNumber: form.phoneNumber || null });
      toast.toast("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <Icons.book size={44} />
            <h1>Join SmartLibrary</h1>
            <p>Create your account and start reserving library seats in seconds.</p>
          </div>
          <div className="auth-hero-pattern" />
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Fill in your details to get started</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Icons.user size={13} /> Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className={errors.fullName ? "input-error" : ""} />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label><Icons.mail size={13} /> Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@uni.edu" className={errors.email ? "input-error" : ""} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label><Icons.phone size={13} /> Phone (Optional)</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Icons.lock size={13} /> Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" className={errors.password ? "input-error" : ""} />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label><Icons.lock size={13} /> Confirm</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter" className={errors.confirmPassword ? "input-error" : ""} />
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <><Icons.loader size={16} /> Creating...</> : <>Create Account <Icons.arrow size={16} /></>}
              </button>
            </form>
            <p className="auth-switch">Already have an account? <a onClick={() => navigate("/login")}>Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
