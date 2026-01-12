import React from "react";

export default function VeterinaireModal({ open, mode, onClose, onSubmit, name, setName, email, setEmail, password, setPassword, error }) {
  const isReadOnly = mode === "details";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  return (
    <div className="modal-overlay" style={{ display: open ? 'flex' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {isCreate ? "Ajouter un vétérinaire" : isEdit ? "Modifier un vétérinaire" : "Détails vétérinaire"}
          </h3>
          <button className="btn-icon btn-danger" onClick={onClose} title="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 6L14 14M6 14L14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <form className="modal-form" onSubmit={onSubmit}>
            <input
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={isReadOnly}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isReadOnly}
            />
            {mode !== "details" && (
              <input
                placeholder={isCreate ? "Mot de passe" : "Nouveau mot de passe (optionnel)"}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required={isCreate}
              />
            )}
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button type="button" onClick={onClose}>
                {mode === "details" ? "Fermer" : "Annuler"}
              </button>
              {mode !== "details" && (
                <button type="submit" className="btn-add">
                  {isEdit ? "Enregistrer" : "Créer"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
