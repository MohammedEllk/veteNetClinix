//import { useContext} from "react";
//import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import MainLayout from "../layout/mainLayout";
import "../styles/dashboard.css";


export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  console.log("user from redux store:", user);


  return (
    <MainLayout>
      <div className="dash-header">
        <h1>Dashboard clinique vétérinaire</h1>
        <p>Bienvenue, Dr {user?.name}</p>
      </div>

      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-label">Propriétaires</div>
          <div className="dash-card-value">3</div>
          <div className="dash-card-sub">Propriétaires enregistrés</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-label">Animaux</div>
          <div className="dash-card-value">3</div>
          <div className="dash-card-sub">Dossiers actifs</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-label">Consultations du jour</div>
          <div className="dash-card-value">5</div>
          <div className="dash-card-sub">À venir aujourd&apos;hui</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-label">Historique consultations</div>
          <div className="dash-card-value">7</div>
          <div className="dash-card-sub">Consultations enregistrées</div>
        </div>
      </div>
    </MainLayout>
  );
}
