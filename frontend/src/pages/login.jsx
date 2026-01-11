// src/pages/Login.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/auth/actions";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

import vetImage from "../assets/clinicVet.png"; // image de la clinique vétérinaire

export default function Login() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await dispatch(login(email, password));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-page">
      {/* Partie gacuhe : login */}
      <div className="login-left">
        <div className="login-card">
          <h1 className="login-title">Connexion</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button">
              Se connecter
            </button>
          </form>

        </div>
      </div>

      {/* Partie droite */}
      <div className="login-right">
        <div className="login-hero">
          <img src={vetImage} alt="Clinique vétérinaire" className="login-hero-img" />
          <div className="login-hero-text">
            <h2>Clinique vétérinaire</h2>
            <p>Suivi des propriétaires, animaux et consultations en toute simplicité.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
