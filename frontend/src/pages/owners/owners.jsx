

import { useEffect, useState } from "react";

import MainLayout from "../../layout/mainLayout";
import { listOwners, createOwner, updateOwner, deleteOwner, getOwner } from "../../api/owners.api";
import OwnerModal from "../../components/ownerModal";
import "../../styles/ownersAnimals.css";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 8;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details"); // "create" | "edit" | "details"
  const [selected, setSelected] = useState(null);

  const loadOwners = async (pageToLoad = 1) => {
    setLoading(true);
    setErr("");
    try {
      const res = await listOwners(q, pageToLoad, perPage);
      setOwners(res.data);
      setLastPage(res.lastPage);
      setPage(pageToLoad);
    } catch (e) {
      setErr("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners(1);
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

  const openEdit = (owner) => {
    setSelected(owner);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDetails = (owner) => {
    setSelected(owner);
    setModalMode("details");
    setModalOpen(true);
  };

  const onDelete = async (owner) => {
    if (!window.confirm("Supprimer ce propriétaire ?")) return;
    setLoading(true);
    try {
      await deleteOwner(owner.id);
      await loadOwners(page);
    } catch {
      setErr("Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  // refresh = true => reload list
  const closeModal = async (refresh) => {
    setModalOpen(false);
    setSelected(null);
    if (refresh) await loadOwners(page);
  };

  // Pour brancher les actions du modal sur l'API fake
  window.createOwner = async (data) => {
    await createOwner(data);
  };
  window.updateOwner = async (id, data) => {
    await updateOwner(id, data);
  };

  // pagination: fenêtre de pages
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const start = Math.max(0, page - 3);
  const end = Math.min(lastPage, page + 2);
  const visiblePages = pages.slice(start, end);

  return (
    <MainLayout>
      <div className="owners-page">
        <div className="owners-head">
          <h2>Propriétaires</h2>
          <div className="owners-search">
            <input
              placeholder="Recherche nom, email, téléphone..."
              value={q}
              onChange={onSearch}
              disabled={loading}
            />
            <button className="btn-primary" onClick={openCreate} disabled={loading}>
              Ajouter
            </button>
          </div>
        </div>
        {err && <div className="page-error">{err}</div>}
        <div className="owners-grid">
          {owners.map((owner) => (
            <div className="owner-card" key={owner.id}>
              <div className="owner-name">{owner.nom}</div>
              <div className="owner-line">{owner.email || "—"}</div>
              <div className="owner-line">{owner.telephone || "—"}</div>
              <div className="owner-line">{owner.adresse || "—"}</div>
              <div className="owner-actions">
                <button className="btn-edit" onClick={() => openEdit(owner)} disabled={loading}>Modifier</button>
                <button className="btn-light" onClick={() => openDetails(owner)} disabled={loading}>Détails</button>
                <button className="btn-danger" onClick={() => onDelete(owner)} disabled={loading}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button className="page-btn" onClick={() => loadOwners(1)} disabled={page === 1 || loading}>&lt;&lt;</button>
          {visiblePages.map((p) => (
            <button
              key={p}
              className={"page-btn" + (p === page ? " active" : "")}
              onClick={() => loadOwners(p)}
              disabled={p === page || loading}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" onClick={() => loadOwners(lastPage)} disabled={page === lastPage || loading}>&gt;&gt;</button>
        </div>

        <OwnerModal open={modalOpen} onClose={closeModal} owner={selected} mode={modalMode} />
      </div>
    </MainLayout>
  );
}
