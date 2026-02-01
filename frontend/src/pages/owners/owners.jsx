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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import MainLayout from "../../layout/mainLayout";
import { listOwners, createOwner, updateOwner, deleteOwner } from "../../api/owners.api";
import OwnerModal from "../../components/ownerModal";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 8;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details");
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

  const closeModal = async (refresh) => {
    setModalOpen(false);
    setSelected(null);
    if (refresh) await loadOwners(page);
  };

  window.createOwner = async (data) => {
    await createOwner(data);
  };
  window.updateOwner = async (id, data) => {
    await updateOwner(id, data);
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Propriétaires
            </Typography>
          </Box>
          <Button
            variant="contained"
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
          placeholder="Recherche nom, email, téléphone..."
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

        {/* Owners Grid */}
        <Grid container spacing={3}>
          {loading && owners.length === 0
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="rectangular" height={120} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : owners.map((owner) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={owner.id}>
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
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          {owner.nom}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {owner.email || "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {owner.telephone || "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <HomeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {owner.adresse || "—"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openDetails(owner)}
                        disabled={loading}
                        title="Détails"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => openEdit(owner)}
                        disabled={loading}
                        title="Modifier"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(owner)}
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

        {/* Pagination */}
        {lastPage > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={lastPage}
              page={page}
              onChange={(e, value) => loadOwners(value)}
              color="primary"
              size="large"
              disabled={loading}
            />
          </Box>
        )}

        <OwnerModal open={modalOpen} onClose={closeModal} owner={selected} mode={modalMode} />
      </Container>
    </MainLayout>
  );
}
