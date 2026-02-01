import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { listDocuments, uploadDocument, deleteDocument, downloadDocument } from "../api/documents.api";

export default function DocumentsModal({ open, onClose, consultation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    if (!consultation?.id) return;
    setLoading(true);
    try {
      const res = await listDocuments(consultation.id);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line
  }, [open, consultation]);

  async function upload(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choisis un fichier (PDF / image).");
      return;
    }
    try {
      await uploadDocument(consultation.id, {
        file,
        description: title,
        type_document: title,
      });
      setTitle("");
      setFile(null);
      await load();
    } catch (err) {
      setError("Erreur upload");
    }
  }

  async function removeDoc(id) {
    if (!window.confirm("Supprimer ce document ?")) return;
    await deleteDocument(id);
    await load();
  }

  async function handleDownload(doc) {
    try {
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.nom_original || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Erreur lors du téléchargement");
    }
  }

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return <PdfIcon />;
    if (mimeType?.includes("image")) return <ImageIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "? KB";
    return (bytes / 1024).toFixed(1) + " KB";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Documents - Consultation #{consultation?.id ?? ""}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Upload Form */}
        <Paper elevation={0} sx={{ bgcolor: "grey.50", p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={2} color="primary">
            <CloudUploadIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
            Ajouter un document
          </Typography>
          <Box component="form" onSubmit={upload}>
            <TextField
              fullWidth
              size="small"
              placeholder="Titre ou description (optionnel)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth>
                Choisir un fichier
                <input
                  type="file"
                  hidden
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!file}
                sx={{ minWidth: 120, textTransform: "none" }}
              >
                Upload
              </Button>
            </Box>
            {file && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                📎 {file.name}
              </Typography>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Documents List */}
        <Typography variant="subtitle2" fontWeight="bold" mb={2}>
          Documents existants ({items.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Aucun document pour cette consultation
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {items.map((d) => (
              <Box key={d.id}>
                <ListItem
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    mb: 1,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.light" }}>{getFileIcon(d.type_mime)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        {d.nom_original || "Document sans nom"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" component="span" color="text.secondary">
                          {d.type_mime || d.type} • {formatFileSize(d.taille)}
                        </Typography>
                        {d.description && (
                          <Typography variant="caption" component="div" color="text.secondary" sx={{ mt: 0.5 }}>
                            {d.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton color="primary" size="small" onClick={() => handleDownload(d)} title="Télécharger">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => removeDoc(d.id)} title="Supprimer">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
