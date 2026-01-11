import { useEffect, useState } from "react";
import "../styles/ownerModal.css";

export default function OwnerModal({ open, onClose, owner, mode }) {
  // mode: "edit" | "details" | "create"
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isDetails = mode === "details";

  const [form, setForm] = useState({ nom: "", telephone: "", email: "", adresse: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErr("");
    if ((isEdit || isDetails) && owner) {
      setForm({
        nom: owner.nom ?? "",
        telephone: owner.telephone ?? "",
        email: owner.email ?? "",
        adresse: owner.adresse ?? "",
      });
    } else if (isCreate) {
      setForm({ nom: "", telephone: "", email: "", adresse: "" });
    }
  }, [open, owner, mode, isEdit, isDetails, isCreate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isEdit) {
        await window.updateOwner(owner.id, form); // à brancher
      } else if (isCreate) {
        await window.createOwner(form); // à brancher
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
            {isEdit ? "Modifier propriétaire" : isCreate ? "Ajouter un propriétaire" : `Détails - ${owner?.nom ?? ""}`}
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
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="adresse"
              placeholder="Adresse"
              value={form.adresse}
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
              <div><b>Nom :</b> {form.nom}</div>
              <div><b>Téléphone :</b> {form.telephone || "—"}</div>
              <div><b>Email :</b> {form.email || "—"}</div>
              <div><b>Adresse :</b> {form.adresse || "—"}</div>
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
