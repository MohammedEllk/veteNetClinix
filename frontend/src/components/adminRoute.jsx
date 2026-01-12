import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext/";

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null; 

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}