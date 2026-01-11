// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import OwnersPage from "./pages//owners/owners.jsx";
import AnimalsPage from "./pages/animals/animalPage.jsx";
import ConsultationsPage from "./pages/consultation/consultation.jsx";
import DocumentsPage from "./pages/documents/documents.jsx";
import VeterinairesPage from "./pages/veterenaire/veterenaires.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import AdminRoute from "./components/adminRoute.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/proprietaires"
        element={
          <ProtectedRoute>
            <OwnersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/animaux"
        element={
          <ProtectedRoute>
            <AnimalsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/consultations"
        element={
          <ProtectedRoute>
            <ConsultationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        }
      />

    <Route
      path="/veterinaires"
      element={
        <AdminRoute>
          <VeterinairesPage />
        </AdminRoute>
      }
    />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
