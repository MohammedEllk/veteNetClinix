import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Skeleton,
  Alert,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocalHospital as LocalHospitalIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import MainLayout from "../../layout/mainLayout";
import VeterinaireModal from "../../components/veterinaireModal";
import { getAllUsers, addUser, updateUser, removeUser } from "../../services/authService.jsx";

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
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "error.main", width: 48, height: 48 }}>
              <LocalHospitalIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="error.dark">
                Vétérinaires
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gestion des comptes vétérinaires (Admin)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={loading}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Ajouter Vétérinaire
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Veterinaires Grid */}
        <Grid container spacing={3}>
          {loading && items.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="rectangular" height={120} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : items.map((v) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={v.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "error.light" }}>
                          <LocalHospitalIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          {v.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {v.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BadgeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            ID: {v.id}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDetails(v)}
                        disabled={loading}
                        title="Détails"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => openEdit(v)}
                        disabled={loading}
                        title="Modifier"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(v)}
                        disabled={loading}
                        title="Supprimer"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {items.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun vétérinaire enregistré
            </Typography>
          </Box>
        )}

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
      </Container>
    </MainLayout>
  );
}
