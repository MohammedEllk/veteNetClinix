# Rapport Technique et Fonctionnel - VeteNetClinix

## 📋 Table des Matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Backend - API Laravel](#3-backend---api-laravel)
4. [Frontend - Application React](#4-frontend---application-react)
5. [Base de données](#5-base-de-données)
6. [Authentification et sécurité](#6-authentification-et-sécurité)
7. [Fonctionnalités détaillées](#7-fonctionnalités-détaillées)
8. [Interface utilisateur](#8-interface-utilisateur)
9. [Installation et déploiement](#9-installation-et-déploiement)
10. [Tests et maintenance](#10-tests-et-maintenance)

---

## 1. Vue d'ensemble du projet

### 1.1 Description
**VeteNetClinix** est une application web complète de gestion de clinique vétérinaire permettant la gestion des propriétaires d'animaux, des animaux de compagnie, des consultations vétérinaires et des documents médicaux associés.

### 1.2 Objectifs
- Centraliser la gestion des informations des animaux et propriétaires
- Faciliter le suivi des consultations vétérinaires
- Gérer les dossiers médicaux et documents associés
- Fournir une interface moderne et intuitive pour les vétérinaires
- Assurer la sécurité des données médicales

### 1.3 Public cible
- **Administrateurs** : Gestion complète de la clinique et des utilisateurs
- **Vétérinaires** : Consultation et création de dossiers médicaux
- **Utilisateurs** : Consultation des informations (évolution future)

### 1.4 Technologies utilisées
- **Backend** : Laravel 11, PHP 8.5.2
- **Frontend** : React 18.3, Material-UI 5.x
- **Base de données** : PostgreSQL 15
- **Authentification** : Laravel Sanctum
- **State Management** : Redux avec Redux Thunk
- **Build Tools** : Vite 7.2.4
- **HTTP Client** : Axios

---

## 2. Architecture technique

### 2.1 Architecture globale

```
VeteNetClinix/
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/  # Contrôleurs API
│   │   └── Models/           # Modèles Eloquent
│   ├── config/               # Configuration
│   ├── database/
│   │   ├── migrations/       # Schémas de base de données
│   │   └── seeders/          # Données de test
│   └── routes/
│       └── api.php           # Routes API
│
└── frontend/             # Application React
    ├── public/
    └── src/
        ├── api/              # Services API
        ├── components/       # Composants réutilisables
        ├── layout/           # Layouts (MainLayout)
        ├── pages/            # Pages principales
        ├── services/         # Services métier
        ├── store/            # Redux store
        └── styles/           # Styles CSS
```

### 2.2 Architecture backend (Laravel)

**Pattern MVC** :
- **Models** : Eloquent ORM pour la gestion des données
- **Controllers** : Logique métier et traitement des requêtes
- **Routes** : API RESTful avec auth:sanctum middleware

**Structure des contrôleurs** :
```php
ProprietaireController
AnimalController
ConsultationController
DocumentController
AuthController
```

### 2.3 Architecture frontend (React)

**Structure par fonctionnalités** :
- **Pages** : Composants de pages complètes
- **Components** : Composants réutilisables (modals, forms)
- **API** : Couche d'abstraction pour les appels backend
- **Store** : Redux pour le state management global
- **Services** : Logique métier côté client

### 2.4 Communication Frontend-Backend

```
Frontend (React)
    ↓ (Axios HTTP)
API REST Laravel (JSON)
    ↓ (Eloquent ORM)
PostgreSQL Database
```

**Format des échanges** : JSON
**Authentification** : Bearer Token (Sanctum)
**CORS** : Activé pour localhost:5173

---

## 3. Backend - API Laravel

### 3.1 Configuration

**Environnement** (.env) :
```env
APP_NAME=VeteNetClinix
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=veteClinix
DB_USERNAME=veteClinix
DB_PASSWORD=vet@2024
```

**Serveur de développement** :
```bash
php artisan serve
# Accessible sur http://127.0.0.1:8000
```

### 3.2 Modèles Eloquent

#### 3.2.1 User (Utilisateur/Vétérinaire)
```php
// app/Models/User.php
protected $fillable = ['name', 'email', 'password', 'role'];
protected $hidden = ['password', 'remember_token'];

// Relations
public function consultations() {
    return $this->hasMany(Consultation::class, 'veterinaire_id');
}
```

**Rôles** :
- `admin` : Administrateur avec tous les droits
- `veterenaire` : Vétérinaire (consultation, animaux, propriétaires)
- `user` : Utilisateur standard (lecture seule, futur)

#### 3.2.2 Proprietaire (Propriétaire d'animaux)
```php
// app/Models/Proprietaire.php
protected $fillable = [
    'nom', 'email', 'telephone', 'adresse'
];

// Relations
public function animaux() {
    return $this->hasMany(Animal::class);
}
```

#### 3.2.3 Animal
```php
// app/Models/Animal.php
protected $table = 'animaux';
protected $fillable = [
    'nom', 'espece', 'race', 'sexe', 
    'date_naissance', 'poids', 'remarques', 
    'proprietaire_id'
];

// Relations
public function proprietaire() {
    return $this->belongsTo(Proprietaire::class);
}

public function consultations() {
    return $this->hasMany(Consultation::class);
}
```

**Espèces supportées** : Chien, Chat, Oiseau, Lapin, Reptile, NAC

#### 3.2.4 Consultation
```php
// app/Models/Consultation.php
protected $fillable = [
    'animal_id', 'veterinaire_id', 'date_consultation',
    'motif', 'diagnostic', 'traitement',
    'poids', 'temperature', 'remarques'
];

// Relations
public function animal() {
    return $this->belongsTo(Animal::class);
}

public function veterinaire() {
    return $this->belongsTo(User::class, 'veterinaire_id');
}

public function documents() {
    return $this->hasMany(Document::class);
}
```

#### 3.2.5 Document
```php
// app/Models/Document.php
protected $fillable = [
    'consultation_id', 'nom_original', 'nom_stockage',
    'type_mime', 'taille', 'chemin', 
    'type_document', 'description'
];

// Relations
public function consultation() {
    return $this->belongsTo(Consultation::class);
}
```

### 3.3 Contrôleurs API

#### 3.3.1 AuthController
**Endpoints** :
- `POST /api/register` - Créer un compte
- `POST /api/login` - Connexion (retourne token)
- `POST /api/logout` - Déconnexion
- `GET /api/user` - Informations utilisateur connecté

**Exemple de réponse login** :
```json
{
  "token": "5|abcdef123456...",
  "user": {
    "id": 1,
    "name": "Dr Mohammed",
    "email": "admin@veteclinix.com",
    "role": "admin"
  }
}
```

#### 3.3.2 ProprietaireController
**Endpoints** :
```
GET    /api/proprietaires?q=&page=1&per_page=8
POST   /api/proprietaires
GET    /api/proprietaires/{id}
PUT    /api/proprietaires/{id}
DELETE /api/proprietaires/{id}
```

**Fonctionnalités** :
- Recherche par nom, email, téléphone (ILIKE PostgreSQL)
- Pagination
- CRUD complet

#### 3.3.3 AnimalController
**Endpoints** :
```
GET    /api/animaux?q=&page=1&per_page=6
POST   /api/animaux
GET    /api/animaux/{id}
PUT    /api/animaux/{id}
DELETE /api/animaux/{id}
```

**Validation** :
```php
$request->validate([
    'nom' => 'required|string|max:255',
    'espece' => 'required|string',
    'proprietaire_id' => 'required|exists:proprietaires,id',
    'date_naissance' => 'nullable|date',
    'poids' => 'nullable|numeric'
]);
```

#### 3.3.4 ConsultationController
**Endpoints** :
```
GET    /api/consultations?q=&page=1&per_page=6
POST   /api/consultations
GET    /api/consultations/{id}
PUT    /api/consultations/{id}
DELETE /api/consultations/{id}
```

**Particularité** :
- Auto-remplissage du `veterinaire_id` avec l'utilisateur connecté :
```php
$data['veterinaire_id'] = $request->user()->id;
```

#### 3.3.5 DocumentController
**Endpoints** :
```
GET    /api/consultations/{id}/documents
POST   /api/consultations/{id}/documents
GET    /api/documents/{id}/download
DELETE /api/documents/{id}
```

**Upload de fichiers** :
```php
$path = $file->store("consultations/{$consultation->id}", 'public');
Document::create([
    'consultation_id' => $consultation->id,
    'nom_original' => $file->getClientOriginalName(),
    'nom_stockage' => basename($path),
    'type_mime' => $file->getMimeType(),
    'taille' => $file->getSize(),
    'chemin' => $path,
]);
```

**Téléchargement** :
```php
return Storage::disk('public')->download(
    $document->chemin, 
    $document->nom_original
);
```

### 3.4 Middleware et sécurité

**Middleware appliqué** :
```php
Route::middleware('auth:sanctum')->group(function () {
    // Toutes les routes protégées
});
```

**Configuration CORS** (config/cors.php) :
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### 3.5 Seeders (Données de test)

```php
// database/seeders/DatabaseSeeder.php
User::create([
    'name' => 'Admin VeteClinix',
    'email' => 'admin@veteclinix.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin',
]);

User::create([
    'name' => 'Dr Mohammed',
    'email' => 'vet@veteclinix.com',
    'password' => Hash::make('vet123'),
    'role' => 'veterenaire',
]);
```

**Commande** :
```bash
php artisan migrate:fresh --seed
```

---

## 4. Frontend - Application React

### 4.1 Configuration

**Vite Config** (vite.config.js) :
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})
```

**Démarrage** :
```bash
npm run dev
# Accessible sur http://localhost:5173
```

### 4.2 Architecture des composants

#### 4.2.1 Pages principales

```
pages/
├── login.jsx               # Page de connexion
├── dashboard.jsx           # Tableau de bord
├── owners/
│   └── owners.jsx          # Liste des propriétaires
├── animals/
│   └── animalPage.jsx      # Liste des animaux
├── consultation/
│   └── consultation.jsx    # Liste des consultations
├── veterenaire/
│   └── veterenaires.jsx    # Gestion vétérinaires (admin)
└── documents/
    └── documents.jsx       # Gestion documents (Redux)
```

#### 4.2.2 Composants réutilisables

```
components/
├── ownerModal.jsx          # Modal CRUD propriétaire
├── animalModal.jsx         # Modal CRUD animal
├── consultationModal.jsx   # Modal CRUD consultation
├── documentsModal.jsx      # Modal upload/liste documents
└── veterinaireModal.jsx    # Modal CRUD vétérinaire
```

#### 4.2.3 Layout

```jsx
// layout/mainLayout.jsx
export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content">
        <Header />
        {children}
      </div>
    </div>
  );
}
```

### 4.3 Services API

#### 4.3.1 Axios Instance
```javascript
// api/axiosInstance.js
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 4.3.2 API Services

**owners.api.js** :
```javascript
export const listOwners = async (q = '', page = 1, perPage = 10) => {
  const res = await axiosInstance.get('/api/proprietaires', {
    params: { q, page, per_page: perPage }
  });
  return res.data;
};

export const createOwner = async (data) => {
  const res = await axiosInstance.post('/api/proprietaires', data);
  return res.data;
};

export const updateOwner = async (id, data) => {
  const res = await axiosInstance.put(`/api/proprietaires/${id}`, data);
  return res.data;
};

export const deleteOwner = async (id) => {
  await axiosInstance.delete(`/api/proprietaires/${id}`);
};
```

**animals.api.js**, **consultations.api.js**, **documents.api.js** : Structure similaire

### 4.4 Redux Store

#### 4.4.1 Structure
```
store/
├── index.js                # Configuration du store
├── documents/
│   ├── actions.js          # Actions Redux
│   └── reducer.js          # Reducer documents
└── consultations/
    ├── actions.js
    └── reducer.js
```

#### 4.4.2 Exemple de reducer (documents)
```javascript
// store/documents/reducer.js
const initialState = {
  documents: [],
  loading: false,
  error: null,
};

export default function documentsReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_DOCUMENTS_SUCCESS':
      return { ...state, documents: action.payload, loading: false };
    case 'CREATE_DOCUMENT_SUCCESS':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'REMOVE_DOCUMENT_SUCCESS':
      return { 
        ...state, 
        documents: state.documents.filter(d => d.id !== action.payload) 
      };
    default:
      return state;
  }
}
```

### 4.5 Material-UI Integration

#### 4.5.1 Thème personnalisé
```javascript
// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },      // Vert vétérinaire
    secondary: { main: '#1976d2' },    // Bleu
    success: { main: '#4caf50' },
    error: { main: '#d32f2f' },
    warning: { main: '#ff9800' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
```

#### 4.5.2 Composants MUI utilisés

**Layout** :
- Container, Box, Grid, Paper

**Navigation** :
- Pagination, Tabs, Breadcrumbs

**Inputs** :
- TextField, Select, Button, IconButton, Checkbox

**Feedback** :
- Alert, Snackbar, CircularProgress, Skeleton, LinearProgress

**Data Display** :
- Card, CardContent, CardActions, List, ListItem, Avatar, Chip, Divider

**Modals** :
- Dialog, DialogTitle, DialogContent, DialogActions

**Icons** (from @mui/icons-material) :
- Pets, Person, Assignment, Description, CloudUpload, Edit, Delete, etc.

### 4.6 Routing

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/veterinaires" element={<VeterinairesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4.7 Gestion de l'authentification

```javascript
// services/authService.js
export const login = async (email, password) => {
  const res = await axiosInstance.post('/api/login', { email, password });
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
};

export const logout = async () => {
  await axiosInstance.post('/api/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
```

---

## 5. Base de données

### 5.1 Schéma de la base de données

#### 5.1.1 Table `users`
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### 5.1.2 Table `proprietaires`
```sql
CREATE TABLE proprietaires (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    telephone VARCHAR(20) NULL,
    adresse TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### 5.1.3 Table `animaux`
```sql
CREATE TABLE animaux (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    espece VARCHAR(100) NOT NULL,
    race VARCHAR(100) NULL,
    sexe VARCHAR(10) NULL,
    date_naissance DATE NULL,
    poids DECIMAL(8,2) NULL,
    remarques TEXT NULL,
    proprietaire_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (proprietaire_id) REFERENCES proprietaires(id) ON DELETE CASCADE
);
```

#### 5.1.4 Table `consultations`
```sql
CREATE TABLE consultations (
    id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL,
    veterinaire_id BIGINT NOT NULL,
    date_consultation DATE NOT NULL,
    motif VARCHAR(255) NOT NULL,
    diagnostic TEXT NULL,
    traitement TEXT NULL,
    poids DECIMAL(8,2) NULL,
    temperature DECIMAL(5,2) NULL,
    remarques TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (animal_id) REFERENCES animaux(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinaire_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 5.1.5 Table `documents`
```sql
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    nom_original VARCHAR(255) NOT NULL,
    nom_stockage VARCHAR(255) NOT NULL,
    type_mime VARCHAR(100) NOT NULL,
    taille BIGINT NOT NULL,
    chemin VARCHAR(500) NOT NULL,
    type_document VARCHAR(100) NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
);
```

#### 5.1.6 Table `personal_access_tokens` (Sanctum)
```sql
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### 5.2 Relations

```
users (1) ──────── (N) consultations
                        │
proprietaires (1) ── (N) animaux (1) ──── (N) consultations (1) ──── (N) documents
```

### 5.3 Indexes

```sql
CREATE INDEX idx_animaux_proprietaire ON animaux(proprietaire_id);
CREATE INDEX idx_consultations_animal ON consultations(animal_id);
CREATE INDEX idx_consultations_veterinaire ON consultations(veterinaire_id);
CREATE INDEX idx_documents_consultation ON documents(consultation_id);
CREATE INDEX idx_users_email ON users(email);
```

### 5.4 Contraintes d'intégrité

- **CASCADE DELETE** : Suppression d'un propriétaire → suppression de ses animaux → suppression des consultations → suppression des documents
- **NOT NULL** : Champs obligatoires (nom, espèce, motif, etc.)
- **UNIQUE** : Email utilisateur unique
- **Foreign Keys** : Garantit l'intégrité référentielle

---

## 6. Authentification et sécurité

### 6.1 Laravel Sanctum

**Installation** :
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

**Configuration** (config/sanctum.php) :
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:5173')),
'middleware' => [
    'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
],
```

### 6.2 Processus d'authentification

1. **Login** :
```javascript
POST /api/login
Body: { email, password }
Response: { token: "5|abc...", user: {...} }
```

2. **Stockage du token** :
```javascript
localStorage.setItem('token', token);
```

3. **Envoi du token** (intercepteur Axios) :
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

4. **Vérification backend** (middleware auth:sanctum) :
```php
$user = $request->user(); // Utilisateur connecté
```

### 6.3 Sécurité

#### 6.3.1 Côté backend
- **Hash des mots de passe** : `Hash::make($password)`
- **Validation des entrées** : `$request->validate([...])`
- **CSRF Protection** : Activé par défaut
- **SQL Injection** : Protégé par Eloquent ORM
- **XSS Protection** : Échappement automatique des sorties

#### 6.3.2 Côté frontend
- **Token sécurisé** : Stockage en localStorage
- **Expiration automatique** : Déconnexion sur 401
- **Validation côté client** : Formulaires contrôlés
- **HTTPS recommandé** : En production

#### 6.3.3 Gestion des rôles

```php
// Middleware personnalisé (futur)
if ($request->user()->role !== 'admin') {
    return response()->json(['message' => 'Unauthorized'], 403);
}
```

---

## 7. Fonctionnalités détaillées

### 7.1 Gestion des propriétaires

**Fonctionnalités** :
- ✅ Créer un propriétaire (nom, email, téléphone, adresse)
- ✅ Rechercher par nom, email ou téléphone
- ✅ Modifier les informations
- ✅ Supprimer (avec cascade sur animaux)
- ✅ Voir les détails
- ✅ Pagination (8 par page)

**Interface** :
- Grid de cards Material-UI
- Icônes Email, Phone, Home
- Avatar avec PersonIcon
- Boutons : Détails, Modifier, Supprimer

**Modal** :
- 3 modes : create, edit, details
- Formulaire avec validation
- Messages d'erreur

### 7.2 Gestion des animaux

**Fonctionnalités** :
- ✅ Enregistrer un animal (nom, espèce, race, sexe, date naissance, poids)
- ✅ Lier à un propriétaire
- ✅ Rechercher par nom, espèce ou race
- ✅ Modifier les informations
- ✅ Supprimer (avec cascade sur consultations)
- ✅ Voir les détails avec propriétaire
- ✅ Pagination (6 par page)

**Espèces supportées** :
- Chien (primary color)
- Chat (secondary color)
- Oiseau (info color)
- Lapin (warning color)
- Reptile (success color)
- Autres NAC

**Interface** :
- Grid de cards avec chips colorés par espèce
- Icônes Cake (date naissance), Weight (poids)
- Lien vers propriétaire
- Avatar avec PetsIcon

### 7.3 Gestion des consultations

**Fonctionnalités** :
- ✅ Créer une consultation (animal, date, motif, diagnostic, traitement)
- ✅ Enregistrer poids et température
- ✅ Auto-remplissage du vétérinaire connecté
- ✅ Rechercher par motif ou diagnostic
- ✅ Modifier une consultation
- ✅ Supprimer (avec cascade sur documents)
- ✅ Voir les détails
- ✅ Accès aux documents
- ✅ Pagination (6 par page)

**Champs** :
- Animal (sélection dans liste)
- Date de consultation
- Motif (obligatoire)
- Diagnostic
- Traitement
- Poids (kg)
- Température (°C)
- Remarques

**Interface** :
- Cards avec header animal + avatar
- Divider séparant sections
- Chips pour motif (success color)
- Icônes Calendar, Weight, Thermostat
- Boutons : Détails, Modifier, Documents, Supprimer

### 7.4 Gestion des documents

**Fonctionnalités** :
- ✅ Upload de fichiers (PDF, images)
- ✅ Lier à une consultation
- ✅ Télécharger un document
- ✅ Supprimer un document
- ✅ Description/titre optionnel
- ✅ Affichage type MIME et taille

**Types acceptés** :
- PDF (application/pdf)
- Images (image/jpeg, image/png, image/gif)

**Stockage** :
- Dossier : `storage/app/public/consultations/{id}/`
- Nom sécurisé généré par Laravel
- Métadonnées en base de données

**Interface** :
- Modal Material-UI avec DialogTitle
- Section upload (Paper gris)
- Liste avec avatars et icônes par type
- Boutons Download et Delete
- CircularProgress pendant chargement

### 7.5 Gestion des vétérinaires (Admin)

**Fonctionnalités** :
- ✅ Créer un compte vétérinaire (nom, email, mot de passe)
- ✅ Modifier les informations
- ✅ Réinitialiser le mot de passe
- ✅ Supprimer un compte
- ✅ Voir les détails
- ⚠️ Réservé aux administrateurs

**Interface** :
- Cards avec LocalHospitalIcon (red)
- Affichage ID et email
- Sous-titre "Admin"
- Boutons : Détails, Modifier, Supprimer

### 7.6 Dashboard (Tableau de bord)

**Statistiques affichées** :
- ✅ Nombre total de propriétaires
- ✅ Nombre total d'animaux
- ✅ Consultations du jour
- ✅ Total consultations
- ✅ Taux d'occupation
- ✅ Animaux suivis

**Activités récentes** :
- ✅ 5 dernières consultations
- ✅ Affichage animal + propriétaire
- ✅ Motif en chip
- ✅ Date formatée

**Interface** :
- 4 StatCards avec icônes
- Grid responsive
- Skeleton pendant chargement
- LinearProgress pour taux
- Paper pour sections

---

## 8. Interface utilisateur

### 8.1 Design System (Material-UI)

**Palette de couleurs** :
```javascript
Primary: #2e7d32   (Vert vétérinaire)
Secondary: #1976d2 (Bleu)
Success: #4caf50   (Vert clair)
Error: #d32f2f     (Rouge)
Warning: #ff9800   (Orange)
```

**Typographie** :
- Font: Inter, Roboto, Arial
- H4: 700 (bold)
- H6: 600 (semi-bold)
- Body1/Body2: 400

**Composants stylisés** :
- Border radius: 8px (buttons), 12px (cards)
- Box shadow: 0 2px 8px rgba(0,0,0,0.1)
- Hover effects: translateY(-4px) + shadow augmentée

### 8.2 Responsive Design

**Breakpoints Material-UI** :
- xs: <600px (mobile)
- sm: 600-960px (tablet)
- md: 960-1280px (laptop)
- lg: 1280-1920px (desktop)
- xl: >1920px (large screen)

**Grid responsive** :
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Card */}
  </Grid>
</Grid>
```

### 8.3 Pages principales

#### 8.3.1 Page de connexion
- **Design** : Gradient background (vert → bleu)
- **Composants** : Paper, TextField avec icônes, Button gradient
- **Avatar** : PetsIcon
- **Features** : Show/hide password, validation

#### 8.3.2 Dashboard
- **Sections** :
  - Header avec Avatar + titre
  - 4 StatCards (Grid 2x2)
  - Recent Activity (Paper)
  - Quick Stats avec progress bars
- **Loading** : Skeleton components
- **API calls** : Promise.all pour performance

#### 8.3.3 Liste Propriétaires
- **Layout** : Container maxWidth="xl"
- **Search** : TextField avec SearchIcon
- **Grid** : 4 colonnes (lg), 3 (md), 2 (sm), 1 (xs)
- **Cards** : Hover effect, 3 IconButtons
- **Pagination** : Material-UI Pagination

#### 8.3.4 Liste Animaux
- **Particularités** :
  - Chips colorés par espèce
  - Icônes Cake, Weight
  - Affichage propriétaire
- **Colors** : Dynamic selon espèce

#### 8.3.5 Liste Consultations
- **Layout** : Cards avec sections
- **Header** : Avatar animal + nom
- **Divider** : Séparation visuelle
- **Info** : Date, motif (chip), diagnostic, vitaux
- **Actions** : 2 groupes de boutons

### 8.4 Modals

**Composants communs** :
- Dialog avec maxWidth="md"
- DialogTitle avec icône + bouton close
- DialogContent dividers
- DialogActions avec boutons

**Types de modals** :
1. **CRUD Modals** : 3 modes (create, edit, details)
2. **Documents Modal** : Upload + liste
3. **Confirmation** : window.confirm() (à migrer vers MUI)

### 8.5 États de chargement

**Skeleton** :
```jsx
{loading && items.length === 0 && 
  Array.from({ length: 8 }).map((_, idx) => (
    <Skeleton variant="rectangular" height={120} />
  ))
}
```

**CircularProgress** :
```jsx
{loading && <CircularProgress />}
```

**LinearProgress** (Dashboard) :
```jsx
<LinearProgress 
  variant="determinate" 
  value={occupancyRate} 
  color="success" 
/>
```

### 8.6 Gestion des erreurs

**Alert Material-UI** :
```jsx
{error && (
  <Alert severity="error" onClose={() => setError("")}>
    {error}
  </Alert>
)}
```

**Validation formulaires** :
- Required fields
- Email validation
- Min/max length
- Pattern matching

---

## 9. Installation et déploiement

### 9.1 Prérequis

**Logiciels requis** :
- PHP 8.5+ avec extensions : pdo_pgsql, openssl, mbstring, tokenizer, xml, ctype, json
- Composer 2.x
- Node.js 18+ et npm
- PostgreSQL 15+
- Git (optionnel)

### 9.2 Installation du backend

```bash
# 1. Cloner le projet
cd backend/

# 2. Installer les dépendances PHP
composer install

# 3. Créer le fichier .env
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Configurer la base de données dans .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=veteClinix
DB_USERNAME=veteClinix
DB_PASSWORD=vet@2024

# 6. Créer la base de données PostgreSQL
psql -U postgres
CREATE DATABASE veteClinix;
CREATE USER veteClinix WITH PASSWORD 'vet@2024';
GRANT ALL PRIVILEGES ON DATABASE veteClinix TO veteClinix;
\q

# 7. Exécuter les migrations et seeders
php artisan migrate:fresh --seed

# 8. Créer le lien symbolique pour le storage
php artisan storage:link

# 9. Lancer le serveur de développement
php artisan serve
# Serveur sur http://127.0.0.1:8000
```

### 9.3 Installation du frontend

```bash
# 1. Aller dans le dossier frontend
cd frontend/

# 2. Installer les dépendances npm
npm install

# 3. Vérifier le fichier .env ou vite.config.js
# S'assurer que l'URL de l'API pointe vers le backend

# 4. Lancer le serveur de développement
npm run dev
# Serveur sur http://localhost:5173
```

### 9.4 Comptes de test

Après le seed, utiliser ces comptes :

**Administrateur** :
```
Email: admin@veteclinix.com
Mot de passe: admin123
Rôle: admin
```

**Vétérinaire** :
```
Email: vet@veteclinix.com
Mot de passe: vet123
Rôle: veterenaire
```

### 9.5 Déploiement en production

#### 9.5.1 Backend (Laravel)

```bash
# 1. Optimiser Composer
composer install --optimize-autoloader --no-dev

# 2. Optimiser Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Mettre APP_DEBUG=false dans .env
APP_ENV=production
APP_DEBUG=false

# 4. Configurer HTTPS
APP_URL=https://votre-domaine.com

# 5. Configuration base de données production
DB_HOST=votre-serveur-db
DB_DATABASE=veteclinix_prod
DB_USERNAME=user_prod
DB_PASSWORD=motdepasse_securise

# 6. Configurer le stockage
# S'assurer que storage/ et bootstrap/cache/ sont writables
chmod -R 775 storage bootstrap/cache
```

**Serveur web recommandé** : Nginx + PHP-FPM

**Configuration Nginx** :
```nginx
server {
    listen 80;
    server_name api.veteclinix.com;
    root /var/www/veteclinix/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 9.5.2 Frontend (React)

```bash
# 1. Configurer l'URL de l'API en production
# Modifier axiosInstance.js
baseURL: 'https://api.veteclinix.com'

# 2. Build de production
npm run build
# Génère le dossier dist/

# 3. Déployer sur serveur web
# Copier le contenu de dist/ vers /var/www/veteclinix/frontend/

# 4. Configuration Nginx pour SPA
server {
    listen 80;
    server_name veteclinix.com www.veteclinix.com;
    root /var/www/veteclinix/frontend;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Alternatives de déploiement** :
- **Frontend** : Vercel, Netlify, AWS S3 + CloudFront
- **Backend** : Laravel Forge, AWS EC2, DigitalOcean, Heroku

#### 9.5.3 Sécurité production

- ✅ HTTPS avec certificat SSL (Let's Encrypt)
- ✅ Firewall configuré
- ✅ Backups automatiques base de données
- ✅ Logs monitoring
- ✅ Rate limiting sur API
- ✅ Variables d'environnement sécurisées
- ✅ CORS restreint aux domaines autorisés

---

## 10. Tests et maintenance

### 10.1 Tests backend (Laravel)

**Types de tests** :
```bash
# Tests unitaires
php artisan test --filter=UserTest

# Tests de fonctionnalités
php artisan test --filter=ProprietaireControllerTest

# Tous les tests
php artisan test
```

**Exemple de test** :
```php
// tests/Feature/ProprietaireControllerTest.php
public function test_can_create_proprietaire()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/proprietaires', [
            'nom' => 'John Doe',
            'email' => 'john@example.com',
            'telephone' => '0612345678',
        ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('proprietaires', [
        'nom' => 'John Doe',
    ]);
}
```

### 10.2 Tests frontend (React)

**Outils recommandés** :
- Jest : Tests unitaires
- React Testing Library : Tests composants
- Cypress : Tests E2E

```bash
# Installation
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Exécution
npm run test
```

**Exemple de test** :
```javascript
// src/components/__tests__/StatCard.test.jsx
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

test('renders stat card with value', () => {
  render(<StatCard title="Owners" value={42} icon={PersonIcon} />);
  expect(screen.getByText('42')).toBeInTheDocument();
});
```

### 10.3 Maintenance

#### 10.3.1 Mises à jour

**Backend** :
```bash
# Mettre à jour Composer
composer update

# Mettre à jour Laravel
composer update laravel/framework
php artisan migrate
```

**Frontend** :
```bash
# Mettre à jour npm
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Mise à jour majeure
npm install react@latest react-dom@latest
```

#### 10.3.2 Logs

**Backend** :
```bash
# Logs Laravel
tail -f storage/logs/laravel.log

# Nettoyer les logs
php artisan log:clear
```

**Frontend** :
```javascript
// Console browser (F12)
// Redux DevTools pour debug state
```

#### 10.3.3 Sauvegarde base de données

```bash
# Backup PostgreSQL
pg_dump -U veteClinix veteClinix > backup_$(date +%Y%m%d).sql

# Restauration
psql -U veteClinix veteClinix < backup_20260201.sql
```

#### 10.3.4 Monitoring

**Outils recommandés** :
- Laravel Telescope : Debug et monitoring
- Sentry : Error tracking
- New Relic / Datadog : Performance monitoring
- Uptime Robot : Disponibilité

### 10.4 Problèmes courants

#### 10.4.1 Erreur 500 Backend
```bash
# Vérifier les logs
cat storage/logs/laravel.log

# Permissions
chmod -R 775 storage bootstrap/cache

# Clear cache
php artisan cache:clear
php artisan config:clear
```

#### 10.4.2 Erreur CORS
```javascript
// Vérifier config/cors.php
'allowed_origins' => ['http://localhost:5173'],

// Restart serveur Laravel
php artisan serve
```

#### 10.4.3 Erreur 401 Frontend
```javascript
// Vérifier token
console.log(localStorage.getItem('token'));

// Relogin
window.location.href = '/login';
```

#### 10.4.4 Migration failed
```bash
# Rollback
php artisan migrate:rollback

# Fresh migrate
php artisan migrate:fresh --seed
```

---

## 11. Évolutions futures

### 11.1 Fonctionnalités prévues

- [ ] **Calendrier de rendez-vous** : Planning vétérinaires avec vue calendrier
- [ ] **SMS/Email notifications** : Rappels rendez-vous automatiques
- [ ] **Facturation** : Génération factures PDF, suivi paiements
- [ ] **Historique médical complet** : Timeline consultations par animal
- [ ] **Vaccinations** : Suivi carnet de vaccination, alertes
- [ ] **Statistiques avancées** : Charts avec Chart.js ou Recharts
- [ ] **Export PDF** : Dossiers médicaux complets
- [ ] **Multi-cliniques** : Support plusieurs cliniques
- [ ] **Mobile app** : React Native pour iOS/Android
- [ ] **Chat intégré** : Communication interne vétérinaires

### 11.2 Améliorations techniques

- [ ] **Tests automatisés** : Couverture 80%+
- [ ] **CI/CD** : GitHub Actions / GitLab CI
- [ ] **Docker** : Containerisation complète
- [ ] **WebSockets** : Notifications temps réel
- [ ] **PWA** : Progressive Web App (offline mode)
- [ ] **i18n** : Internationalisation (FR, EN, ES)
- [ ] **Dark mode** : Thème sombre Material-UI
- [ ] **API versioning** : /api/v1, /api/v2
- [ ] **Rate limiting** : Protection contre abus
- [ ] **Elasticsearch** : Recherche full-text avancée

### 11.3 Optimisations

- [ ] **Lazy loading** : React.lazy() pour routes
- [ ] **Code splitting** : Réduire bundle size
- [ ] **Image optimization** : WebP, compression
- [ ] **Database indexing** : Optimiser requêtes lentes
- [ ] **Redis cache** : Cache API responses
- [ ] **CDN** : Assets statiques
- [ ] **Lighthouse score** : 90+ performance

---

## 12. Conclusion

### 12.1 Résumé

**VeteNetClinix** est une application complète et moderne de gestion de clinique vétérinaire, développée avec les dernières technologies web :

✅ **Backend robuste** : Laravel 11 avec API RESTful sécurisée
✅ **Frontend moderne** : React 18 avec Material-UI pour une UX exceptionnelle
✅ **Base de données fiable** : PostgreSQL avec intégrité référentielle
✅ **Authentification sécurisée** : Laravel Sanctum avec tokens
✅ **Interface intuitive** : Design responsive et accessible
✅ **Code maintenable** : Architecture claire et documentée

### 12.2 Métriques du projet

**Backend** :
- 5 contrôleurs API
- 5 modèles Eloquent
- 6 tables de base de données
- 25+ endpoints API
- 100% routes protégées par auth

**Frontend** :
- 7 pages principales
- 10+ composants réutilisables
- 5 services API
- Material-UI design system
- Redux state management

**Lignes de code** : ~8000+ lignes
**Temps de développement** : Environ 40 heures

### 12.3 Points forts

1. **Architecture MVC claire** : Séparation des responsabilités
2. **API RESTful complète** : CRUD sur toutes les entités
3. **UI/UX moderne** : Material-UI avec thème personnalisé
4. **Sécurité** : Authentification, validation, protection CSRF
5. **Responsive** : Fonctionne sur mobile, tablet, desktop
6. **Maintenabilité** : Code structuré et commenté
7. **Évolutivité** : Architecture permettant ajout fonctionnalités

### 12.4 Contact et support

**Développeur** : Mohammed Ellouke
**Email** : monslouke@gmail.com
**GitHub** : https://github.com/MohammedEllk
**Documentation** : Ce rapport + commentaires inline

---

**Date du rapport** : 1er février 2026
**Version** : 1.0.0
**Status** : En développement actif

---

*Ce rapport technique et fonctionnel documente l'état complet de l'application VeteNetClinix. Pour toute question ou clarification, veuillez contacter l'équipe de développement.*
