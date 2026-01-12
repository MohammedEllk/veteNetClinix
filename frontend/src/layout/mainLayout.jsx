// src/layout/MainLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import "./mainLayout.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth/actions";

export default function MainLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  console.log("user", user);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">VeteClinix</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            Dashboard
          </NavLink>
          <NavLink to="/proprietaires" className="sidebar-link">
            Propriétaires
          </NavLink>
          <NavLink to="/animaux" className="sidebar-link">
            Animaux
          </NavLink>
          <NavLink to="/consultations" className="sidebar-link">
            Consultations
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/veterinaires" className="sidebar-link">
              Vétérinaires
            </NavLink>
          )}
        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
