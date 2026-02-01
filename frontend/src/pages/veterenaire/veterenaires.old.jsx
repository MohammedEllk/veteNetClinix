
import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/mainLayout";
import "../../styles/ownersAnimals.css";
import VeterinaireModal from "../../components/veterinaireModal";
import { getAllUsers, addUser, updateUser, removeUser } from "../../services/authService.jsx";

// Modèle JS pour un vétérinaire
// { id, name, email, password, role: "veterenaire" }

// API vétérinaires basée sur les users (role=veterenaire)
// eslint-disable-next-line react-refresh/only-export-components
export const veterinairesApi = {
  list: async () => (getAllUsers().filter(u => u.role === "veterenaire")),
  create: async (data) => addUser({ ...data, role: "veterenaire" }),
  update: async (id, data) => updateUser(id, { ...data, role: "veterenaire" }),
  remove: async (id) => removeUser(id),
};

function pickFirstError(err) {
  const errors = err?.response?.data?.errors;
  if (!errors) return null;
  const firstKey = Object.keys(errors)[0];
  return errors[firstKey]?.[0] || null;
}

export default function VeterinairesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // modal
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit" | "details"
  const [selected, setSelected] = useState(null);
  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // seulement create / reset password
  const [error, setError] = useState("");

  const isReadOnly = useMemo(() => mode === "details", [mode]);
  const isEdit = useMemo(() => mode === "edit", [mode]);
  const isCreate = useMemo(() => mode === "create", [mode]);

  async function load() {
    setLoading(true);
    try {
      const data = await veterinairesApi.list();
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSelected(null);
  }

  function openCreate() {
    resetForm();
    setMode("create");
    setOpen(true);
  }

  function openDetails(v) {
    setSelected(v);
    setMode("details");
    setError("");
    setName(v?.name || "");
    setEmail(v?.email || "");
    setPassword("");
    setOpen(true);
  }

  function openEdit(v) {
    setSelected(v);
    setMode("edit");
    setError("");
    setName(v?.name || "");
    setEmail(v?.email || "");
    setPassword("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isCreate) {
        await veterinairesApi.create({ name, email, password });
      } else if (isEdit) {
        const payload = { name, email };
        if (password?.trim()) payload.password = password.trim();
        await veterinairesApi.update(selected.id, payload);
      }
      closeModal();
      resetForm();
      load();
    } catch (err) {
      setError(
        pickFirstError(err) ||
          (isEdit ? "Erreur lors de la modification" : "Erreur lors de la création")
      );
    }
  }

  async function remove(v) {
    if (!window.confirm(`Supprimer ${v.name} ?`)) return;
    try {
      await veterinairesApi.remove(v.id);
      load();
    } catch (e) {
      alert("Erreur suppression");
    }
  }

  const modalTitle =
    mode === "create"
      ? "Ajouter un vétérinaire"
      : mode === "edit"
      ? "Modifier un vétérinaire"
      : "Détails vétérinaire";

  return (
    <MainLayout>
      <div className="page-header">
        <h2 className="page-title">Vétérinaires (Admin)</h2>
        <button className="btn-add" onClick={openCreate}>
          Ajouter vétérinaire
        </button>
      </div>

      {loading && <p>Chargement...</p>}

      <div className="cards-grid">
        {items.map((v) => (
          <div key={v.id} className="animal-card">
            <div className="animal-name">{v.name}</div>
            <div className="animal-owner">{v.email}</div>
            <div className="card-actions">
              <button className="btn-light" onClick={() => openDetails(v)}>
                Détails
              </button>
              <button className="btn-purple" onClick={() => openEdit(v)}>
                Modifier
              </button>
              <button className="btn-icon btn-danger" title="Supprimer" onClick={() => remove(v)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6L14 14M6 14L14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <VeterinaireModal
        open={open}
        mode={mode}
        onClose={closeModal}
        onSubmit={submit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
      />
    </MainLayout>
  );
}
