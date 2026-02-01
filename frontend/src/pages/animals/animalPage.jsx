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
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  FitnessCenter as WeightIcon,
} from "@mui/icons-material";
import MainLayout from "../../layout/mainLayout";
import { listAnimals, createAnimal, updateAnimal, deleteAnimal } from "../../api/animals.api";
import { listOwners } from "../../api/owners.api";
import AnimalModal from "../../components/animalModal";

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
  const [modalMode, setModalMode] = useState("details");
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

  window.createAnimal = async (data) => {
    await createAnimal(data);
  };
  window.updateAnimal = async (id, data) => {
    await updateAnimal(id, data);
  };

  const getAnimalColor = (espece) => {
    const colors = {
      Chien: "primary",
      Chat: "secondary",
      Oiseau: "info",
      Lapin: "warning",
      Reptile: "success",
    };
    return colors[espece] || "default";
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main", width: 48, height: 48 }}>
              <PetsIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              Liste des Animaux
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
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
          placeholder="Recherche nom, espèce, race..."
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

        {/* Animals Grid */}
        <Grid container spacing={3}>
          {loading && animals.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="rectangular" height={150} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : animals.map((animal) => {
                const owner = owners.find((o) => o.id === animal.proprietaire_id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={animal.id}>
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
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "secondary.light" }}>
                              <PetsIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                              {animal.nom}
                            </Typography>
                          </Box>
                          <Chip
                            label={animal.espece}
                            color={getAnimalColor(animal.espece)}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          {animal.race && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Race:</strong> {animal.race}
                            </Typography>
                          )}
                          {animal.sexe && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Sexe:</strong> {animal.sexe}
                            </Typography>
                          )}
                          {animal.date_naissance && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CakeIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(animal.date_naissance).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                          {animal.poids && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <WeightIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {animal.poids} kg
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="primary.main" fontWeight="medium">
                              {owner ? owner.nom : "—"}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => openDetails(animal)}
                          disabled={loading}
                          title="Détails"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => openEdit(animal)}
                          disabled={loading}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(animal)}
                          disabled={loading}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
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
              onChange={(e, value) => loadAnimals(value)}
              color="secondary"
              size="large"
              disabled={loading}
            />
          </Box>
        )}

        <AnimalModal
          open={modalOpen}
          onClose={closeModal}
          animal={selected}
          mode={modalMode}
          owners={owners}
        />
      </Container>
    </MainLayout>
  );
}
