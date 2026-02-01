import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Pagination,
  InputAdornment,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Thermostat as ThermostatIcon,
  FitnessCenter as WeightIcon,
} from "@mui/icons-material";
import MainLayout from "../../layout/mainLayout";
import { listConsultations, createConsultation, updateConsultation, deleteConsultation } from "../../api/consultations.api";
import { listAnimals } from "../../api/animals.api";
import ConsultationModal from "../../components/consultationModal";
import DocumentsModal from "../../components/documentsModal";

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
  const [modalMode, setModalMode] = useState("details");
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

  window.createConsultation = async (data) => {
    await createConsultation(data);
  };
  window.updateConsultation = async (id, data) => {
    await updateConsultation(id, data);
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "success.main", width: 48, height: 48 }}>
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="success.dark">
              Liste des Consultations
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
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
            Ajouter
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Recherche motif, diagnostic..."
          value={q}
          onChange={onSearch}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {/* Error Alert */}
        {err && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {err}
          </Alert>
        )}

        {/* Consultations Grid */}
        <Grid container spacing={3}>
          {loading && consultations.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="rectangular" height={180} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : consultations.map((consultation) => {
                const animal = animals.find((a) => a.id === consultation.animal_id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={consultation.id}>
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
                        {/* Animal Header */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: "success.light" }}>
                            <PetsIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {animal ? animal.nom : "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {animal ? `${animal.espece}` : "Animal non trouvé"}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Consultation Info */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(consultation.date_consultation).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Chip
                            label={consultation.motif}
                            color="success"
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                          />

                          {consultation.diagnostic && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Diagnostic:</strong> {consultation.diagnostic}
                            </Typography>
                          )}

                          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                            {consultation.poids && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <WeightIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {consultation.poids} kg
                                </Typography>
                              </Box>
                            )}
                            {consultation.temperature && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <ThermostatIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {consultation.temperature} °C
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => openDetails(consultation)}
                            disabled={loading}
                            title="Détails"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => openEdit(consultation)}
                            disabled={loading}
                            title="Modifier"
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openDocs(consultation)}
                            disabled={loading}
                            title="Documents"
                          >
                            <DescriptionIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(consultation)}
                            disabled={loading}
                            title="Supprimer"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>

        {/* Pagination */}
        {lastPage > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={lastPage}
              page={page}
              onChange={(e, value) => loadConsultations(value)}
              color="success"
              size="large"
              disabled={loading}
            />
          </Box>
        )}

        <ConsultationModal
          open={modalOpen}
          onClose={closeModal}
          consultation={selected}
          mode={modalMode}
          animals={animals}
        />
        <DocumentsModal
          open={docOpen}
          onClose={() => setDocOpen(false)}
          consultation={docConsultation}
        />
      </Container>
    </MainLayout>
  );
}
