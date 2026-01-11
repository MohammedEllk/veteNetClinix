
import { useEffect, useState } from "react";
import MainLayout from "../../layout/mainLayout";
import { listAnimals, createAnimal, updateAnimal, deleteAnimal, getAnimal } from "../../api/animals.api";
import { listOwners } from "../../api/owners.api";
import AnimalModal from "../../components/animalModal";
import "../../styles/ownersAnimals.css";
import "../../styles/animaux.css";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 6;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details"); // "create" | "edit" | "details"
  const [selected, setSelected] = useState(null);

  const loadAnimals = async (pageToLoad = 1) => {
    setLoading(true);
    setErr("");
    try {
      const res = await listAnimals(q, pageToLoad, perPage);
      setAnimals(res.data);
      setLastPage(res.lastPage);
      setPage(pageToLoad);
    } catch (e) {
      setErr("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const loadOwners = async () => {
    const res = await listOwners();
    setOwners(res.data || []);
  };

  useEffect(() => {
    loadAnimals(1);
    loadOwners();
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

  const openEdit = (animal) => {
    setSelected(animal);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDetails = (animal) => {
    setSelected(animal);
    setModalMode("details");
    setModalOpen(true);
  };

  const onDelete = async (animal) => {
    if (!window.confirm("Supprimer cet animal ?")) return;
    setLoading(true);
    try {
      await deleteAnimal(animal.id);
      await loadAnimals(page);
    } catch {
      setErr("Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = async (refresh) => {
    setModalOpen(false);
    setSelected(null);
    if (refresh) await loadAnimals(page);
  };

  // pagination: fenêtre de pages
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const start = Math.max(0, page - 3);
  const end = Math.min(lastPage, page + 2);
  const visiblePages = pages.slice(start, end);

  // Pour brancher les actions du modal sur l'API fake
  window.createAnimal = async (data) => {
    await createAnimal(data);
  };
  window.updateAnimal = async (id, data) => {
    await updateAnimal(id, data);
  };

  return (
    <MainLayout>
      <div className="animals-header">
        <div className="hello">Bonjour Dr Mohammed</div>
        <h2 className="title">Liste des animaux</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="Recherche nom, espèce, race..."
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
          {animals.map((animal) => {
            const owner = owners.find(o => o.id === animal.proprietaire_id);
            return (
              <div className="animal-card" key={animal.id}>
                <div className="animal-name">{animal.nom}</div>
                <div className="animal-sub">{animal.espece} {animal.race ? `(${animal.race})` : ""}</div>
                <div className="animal-owner">Propriétaire : {owner ? owner.nom : "—"}</div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => openEdit(animal)} disabled={loading}>Modifier</button>
                  <button className="btn-light" onClick={() => openDetails(animal)} disabled={loading}>Détails</button>
                  <button className="btn-danger" onClick={() => onDelete(animal)} disabled={loading}>Supprimer</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pagination">
          <button className="page-btn" onClick={() => loadAnimals(1)} disabled={page === 1 || loading}>&lt;&lt;</button>
          {visiblePages.map((p) => (
            <button
              key={p}
              className={"page-btn" + (p === page ? " active" : "")}
              onClick={() => loadAnimals(p)}
              disabled={p === page || loading}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" onClick={() => loadAnimals(lastPage)} disabled={page === lastPage || loading}>&gt;&gt;</button>
        </div>

        <AnimalModal open={modalOpen} onClose={closeModal} animal={selected} mode={modalMode} owners={owners} />
      </div>
    </MainLayout>
  );
}