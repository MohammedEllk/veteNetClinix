
import { useEffect, useState } from "react";
import MainLayout from "../../layout/mainLayout";
import { listConsultations, createConsultation, updateConsultation, deleteConsultation } from "../../api/consultations.api";
import { listAnimals } from "../../api/animals.api";
import ConsultationModal from "../../components/consultationModal";
import DocumentsModal from "../../components/documentsModal";
import "../../styles/consultation.css";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 6;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details"); // "create" | "edit" | "details"
  const [selected, setSelected] = useState(null);
  const [docOpen, setDocOpen] = useState(false);
  const [docConsultation, setDocConsultation] = useState(null);

  const loadConsultations = async (pageToLoad = 1) => {
    setLoading(true);
    setErr("");
    try {
      const res = await listConsultations(q, pageToLoad, perPage);
      setConsultations(res.data);
      setLastPage(res.lastPage);
      setPage(pageToLoad);
    } catch (e) {
      setErr("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const loadAnimals = async () => {
    const res = await listAnimals();
    setAnimals(res.data || []);
  };

  useEffect(() => {
    loadConsultations(1);
    loadAnimals();
    // eslint-disable-next-line
  }, [q]);

  const onSearch = (e) => {
    setQ(e.target.value);
  };

  const openCreate = () => {
    setSelected(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (consultation) => {
    setSelected(consultation);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDetails = (consultation) => {
    setSelected(consultation);
    setModalMode("details");
    setModalOpen(true);
  };

  const openDocs = (consultation) => {
    setDocConsultation(consultation);
    setDocOpen(true);
  };

  const onDelete = async (consultation) => {
    if (!window.confirm("Supprimer cette consultation ?")) return;
    setLoading(true);
    try {
      await deleteConsultation(consultation.id);
      await loadConsultations(page);
    } catch {
      setErr("Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = async (refresh) => {
    setModalOpen(false);
    setSelected(null);
    if (refresh) await loadConsultations(page);
  };

  // pagination: fenêtre de pages
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const start = Math.max(0, page - 3);
  const end = Math.min(lastPage, page + 2);
  const visiblePages = pages.slice(start, end);

  // Pour brancher les actions du modal sur l'API fake
  window.createConsultation = async (data) => {
    await createConsultation(data);
  };
  window.updateConsultation = async (id, data) => {
    await updateConsultation(id, data);
  };

  return (
    <MainLayout>
      <div className="animals-header">
        <div className="hello">Bonjour Dr Mohammed</div>
        <h2 className="title">Liste des consultations</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="Recherche motif, diagnostic..."
            value={q}
            onChange={onSearch}
            disabled={loading}
          />
          <button className="btn-green" onClick={openCreate} disabled={loading}>
            Ajouter
          </button>
        </div>
        {err && <div className="page-error">{err}</div>}
        <div className="cards-grid">
          {consultations.map((consultation) => {
            const animal = animals.find(a => a.id === consultation.animal_id);
            return (
              <div className="animal-card" key={consultation.id}>
                <div className="animal-name">{animal ? animal.nom : "—"}</div>
                <div className="animal-sub">{consultation.motif} ({consultation.date_consultation})</div>
                <div className="animal-owner">Diagnostic : {consultation.diagnostic || "—"}</div>
                <div className="animal-owner">Poids : {consultation.poids || "—"} kg | Température : {consultation.temperature || "—"} °C</div>
                <div className="card-actions">
                  <button className="btn-purple" onClick={() => openEdit(consultation)} disabled={loading}>Modifier</button>
                  <button className="btn" onClick={() => openDetails(consultation)} disabled={loading}>Détails</button>
                  <button className="btn" onClick={() => openDocs(consultation)} disabled={loading}>Documents</button>
                  <button className="btn-icon btn-danger" title="Supprimer" onClick={() => onDelete(consultation)} disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14M6 14L14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pagination">
          <button className="page-btn" onClick={() => loadConsultations(1)} disabled={page === 1 || loading}>&lt;&lt;</button>
          {visiblePages.map((p) => (
            <button
              key={p}
              className={"page-btn" + (p === page ? " active" : "")}
              onClick={() => loadConsultations(p)}
              disabled={p === page || loading}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" onClick={() => loadConsultations(lastPage)} disabled={page === lastPage || loading}>&gt;&gt;</button>
        </div>

        <ConsultationModal open={modalOpen} onClose={closeModal} consultation={selected} mode={modalMode} animals={animals} />
        <DocumentsModal open={docOpen} onClose={() => setDocOpen(false)} consultation={docConsultation} />
      </div>
    </MainLayout>
  );
}
