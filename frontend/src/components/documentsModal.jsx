import { useEffect, useState } from "react";
import { listDocuments, uploadDocument, deleteDocument } from "../api/documents.api";
import "../styles/ownerModal.css";

export default function DocumentsModal({ open, onClose, consultation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    if (!consultation?.id) return;
    setLoading(true);
    try {
      const res = await listDocuments(consultation.id);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open, consultation]);

  async function upload(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choisis un fichier (PDF / image).");
      return;
    }
    try {
      await uploadDocument(consultation.id, { title, file });
      setTitle("");
      setFile(null);
      await load();
    } catch (err) {
      setError("Erreur upload");
    }
  }

  async function removeDoc(id) {
    if (!window.confirm("Supprimer ce document ?")) return;
    await deleteDocument(id);
    await load();
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Documents - Consultation #{consultation?.id ?? ""}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={upload} className="modal-body">
          <input
            placeholder="Titre (optionnel)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-light" onClick={onClose}>
              Fermer
            </button>
            <button type="submit" className="btn-primary">
              Upload
            </button>
          </div>
        </form>
        <hr style={{ margin: "16px 0" }} />
        {loading && <p>Chargement...</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            >
              <div>
                <b>{d.title}</b>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {d.type} — {d.size ? (d.size / 1024).toFixed(1) : "?"} KB
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button className="btn" onClick={() => alert('Download: ' + d.data)}>
                  Télécharger
                </button>
                <button className="btn btn-danger" onClick={() => removeDoc(d.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <p>Aucun document.</p>}
        </div>
      </div>
    </div>
  );
}
