import { useEffect, useState } from "react";
import "../styles/ownerModal.css";

export default function ConsultationModal({ open, onClose, consultation, mode, animals }) {
  // mode: "edit" | "details" | "create"
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isDetails = mode === "details";

  const [form, setForm] = useState({
    animal_id: "",
    date_consultation: "",
    motif: "",
    diagnostic: "",
    traitement: "",
    recommandations: "",
    poids: "",
    temperature: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErr("");
    if ((isEdit || isDetails) && consultation) {
      setForm({
        animal_id: consultation.animal_id ?? "",
        date_consultation: consultation.date_consultation ?? "",
        motif: consultation.motif ?? "",
        diagnostic: consultation.diagnostic ?? "",
        traitement: consultation.traitement ?? "",
        recommandations: consultation.recommandations ?? "",
        poids: consultation.poids ?? "",
        temperature: consultation.temperature ?? ""
      });
    } else if (isCreate) {
      setForm({ animal_id: "", date_consultation: "", motif: "", diagnostic: "", traitement: "", recommandations: "", poids: "", temperature: "" });
    }
  }, [open, consultation, mode, isEdit, isDetails, isCreate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isEdit) {
        await window.updateConsultation(consultation.id, form); // à brancher
      } else if (isCreate) {
        await window.createConsultation(form); // à brancher
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
            {isEdit ? "Modifier consultation" : isCreate ? "Ajouter une consultation" : `Détails - Consultation #${consultation?.id ?? ""}`}
          </h3>
          <button className="modal-close" onClick={() => onClose(false)}>✕</button>
        </div>
        {err && <div className="modal-error">{err}</div>}
        {(isEdit || isCreate) && (
          <form onSubmit={handleSubmit} className="modal-body">
            <select name="animal_id" value={form.animal_id} onChange={handleChange} required>
              <option value="">Sélectionner un animal</option>
              {animals.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
            <input
              name="date_consultation"
              type="date"
              placeholder="Date de consultation"
              value={form.date_consultation}
              onChange={handleChange}
              required
            />
            <input
              name="motif"
              placeholder="Motif"
              value={form.motif}
              onChange={handleChange}
              required
            />
            <input
              name="diagnostic"
              placeholder="Diagnostic"
              value={form.diagnostic}
              onChange={handleChange}
            />
            <input
              name="traitement"
              placeholder="Traitement"
              value={form.traitement}
              onChange={handleChange}
            />
            <input
              name="recommandations"
              placeholder="Recommandations"
              value={form.recommandations}
              onChange={handleChange}
            />
            <input
              name="poids"
              type="number"
              step="0.1"
              placeholder="Poids (kg)"
              value={form.poids}
              onChange={handleChange}
            />
            <input
              name="temperature"
              type="number"
              step="0.1"
              placeholder="Température (°C)"
              value={form.temperature}
              onChange={handleChange}
            />
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
              <div><b>Animal :</b> {animals.find(a => a.id === Number(form.animal_id))?.nom || "—"}</div>
              <div><b>Date :</b> {form.date_consultation}</div>
              <div><b>Motif :</b> {form.motif}</div>
              <div><b>Diagnostic :</b> {form.diagnostic}</div>
              <div><b>Traitement :</b> {form.traitement}</div>
              <div><b>Recommandations :</b> {form.recommandations}</div>
              <div><b>Poids :</b> {form.poids || "—"} kg</div>
              <div><b>Température :</b> {form.temperature || "—"} °C</div>
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
