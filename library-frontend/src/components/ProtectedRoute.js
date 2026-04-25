import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icons from "./Icons";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="page-loading"><Icons.loader size={30} /><p>Loading...</p></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;

  return children;
}
