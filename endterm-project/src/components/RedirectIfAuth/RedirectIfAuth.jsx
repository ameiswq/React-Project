import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../RequireAuth/requireAuth.css"; 

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="auth-loading">Checking auth...</div>;
  }
  if (user) {
    const to = location.state?.from || "/profile";
    return <Navigate to={to} replace />;
  }

  return children;
}
