import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Avatar,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import MainLayout from '../../layout/mainLayout';
import { fetchDocuments, createDocument, removeDocument } from '../../store/documents/actions';
import { fetchConsultations } from '../../store/consultations/actions';

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const { documents } = useSelector((state) => state.documents);
  const { consultations } = useSelector((state) => state.consultations);
  const [newDocument, setNewDocument] = useState({ name: '', type: '', consultationId: '' });

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchConsultations());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        name: file.name,
        type: file.type.split('/')[1],
        data: 'fake-base64-data'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDocument.name && newDocument.consultationId) {
      dispatch(createDocument(newDocument));
      setNewDocument({ name: '', type: '', consultationId: '' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce document ?')) {
      dispatch(removeDocument(id));
    }
  };

  const getConsultationName = (id) => {
    const cons = consultations.find(c => c.id === id);
    return cons ? `Consultation ${cons.id}` : 'Unknown';
  };

  const getFileIcon = (type) => {
    if (type === 'pdf') return <PdfIcon />;
    if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(type)) return <ImageIcon />;
    return <FileIcon />;
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: "warning.main", width: 48, height: 48 }}>
            <DescriptionIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" color="warning.dark">
            Gestion des Documents
          </Typography>
        </Box>

        {/* Upload Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Télécharger un Document
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ height: 56 }}
                >
                  Choisir un fichier
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </Button>
                {newDocument.name && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {newDocument.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth required>
                  <InputLabel>Consultation</InputLabel>
                  <Select
                    name="consultationId"
                    value={newDocument.consultationId}
                    onChange={handleInputChange}
                    label="Consultation"
                  >
                    <MenuItem value="">
                      <em>Sélectionner une consultation</em>
                    </MenuItem>
                    {consultations.map((cons) => (
                      <MenuItem key={cons.id} value={cons.id}>
                        Consultation {cons.id} - {cons.date}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  fullWidth
                  sx={{ height: 56, textTransform: 'none', fontSize: '1rem' }}
                >
                  Télécharger
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Documents List */}
        <Typography variant="h6" fontWeight="bold" mb={3}>
          <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Liste des Documents
        </Typography>

        <Grid container spacing={3}>
          {documents.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Aucun document disponible
                </Typography>
              </Box>
            </Grid>
          ) : (
            documents.map((doc) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
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
                      <Avatar sx={{ bgcolor: "warning.light" }}>
                        {getFileIcon(doc.type)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {doc.name}
                        </Typography>
                        <Chip
                          label={doc.type?.toUpperCase() || 'FILE'}
                          size="small"
                          color="warning"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <strong>Consultation:</strong> {getConsultationName(doc.consultationId)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => alert('Download: ' + doc.data)}
                      title="Télécharger"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(doc.id)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
}
