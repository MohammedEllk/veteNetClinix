import { useEffect, useState } from "react";
import "../styles/ownerModal.css";

export default function AnimalModal({ open, onClose, animal, mode, owners }) {
  // mode: "edit" | "details" | "create"
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isDetails = mode === "details";

  const [form, setForm] = useState({
    nom: "",
    espece: "",
    race: "",
    sexe: "M",
    date_naissance: "",
    proprietaire_id: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErr("");
    if ((isEdit || isDetails) && animal) {
      setForm({
        nom: animal.nom ?? "",
        espece: animal.espece ?? "",
        race: animal.race ?? "",
        sexe: animal.sexe ?? "M",
        date_naissance: animal.date_naissance ?? "",
        proprietaire_id: animal.proprietaire_id ?? ""
      });
    } else if (isCreate) {
      setForm({ nom: "", espece: "", race: "", sexe: "M", date_naissance: "", proprietaire_id: "" });
    }
  }, [open, animal, mode, isEdit, isDetails, isCreate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isEdit) {
        await window.updateAnimal(animal.id, form); // à brancher
      } else if (isCreate) {
        await window.createAnimal(form); // à brancher
      }
      onClose(true);
    } catch (e) {
      setErr("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            {isEdit ? "Modifier animal" : isCreate ? "Ajouter un animal" : `Détails - ${animal?.nom ?? ""}`}
          </h3>
          <button className="modal-close" onClick={() => onClose(false)}>✕</button>
        </div>
        {err && <div className="modal-error">{err}</div>}
        {(isEdit || isCreate) && (
          <form onSubmit={handleSubmit} className="modal-body">
            <input
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
            <input
              name="espece"
              placeholder="Espèce"
              value={form.espece}
              onChange={handleChange}
              required
            />
            <input
              name="race"
              placeholder="Race"
              value={form.race}
              onChange={handleChange}
            />
            <select name="sexe" value={form.sexe} onChange={handleChange} required>
              <option value="M">Mâle</option>
              <option value="F">Femelle</option>
            </select>
            <input
              name="date_naissance"
              type="date"
              placeholder="Date de naissance"
              value={form.date_naissance}
              onChange={handleChange}
            />
            <select name="proprietaire_id" value={form.proprietaire_id} onChange={handleChange} required>
              <option value="">Sélectionner un propriétaire</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.nom}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button type="button" className="btn-light" onClick={() => onClose(false)}>
                Annuler
              </button>
              <button className="btn-primary" disabled={loading}>
                {loading ? "..." : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
        {isDetails && (
          <div className="modal-body">
            <div className="details-grid">
              <div><b>Nom :</b> {form.nom}</div>
              <div><b>Espèce :</b> {form.espece}</div>
              <div><b>Race :</b> {form.race || "—"}</div>
              <div><b>Sexe :</b> {form.sexe === "M" ? "Mâle" : "Femelle"}</div>
              <div><b>Date de naissance :</b> {form.date_naissance || "—"}</div>
              <div><b>Propriétaire :</b> {owners.find(o => o.id === Number(form.proprietaire_id))?.nom || "—"}</div>
            </div>
            <div className="modal-actions">
              <button className="btn-light" onClick={() => onClose(false)}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
