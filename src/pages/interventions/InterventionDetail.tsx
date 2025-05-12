import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { interventionService } from '../../services/interventionService';
import { useAuth } from '../../context/AuthContext';
import { Intervention, InterventionNote, Attachment } from '../../types/intervention';
import dayjs from 'dayjs';

const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    loadIntervention();
  }, [id]);

  const loadIntervention = async () => {
    try {
      const data = await interventionService.getInterventionById(id!);
      setIntervention(data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'intervention');
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    try {
      await interventionService.addNote(id, newNote);
      setNewNote('');
      setSuccess('Note ajoutée avec succès');
      loadIntervention();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!id) return;
    try {
      await interventionService.deleteNote(id, noteId);
      setSuccess('Note supprimée avec succès');
      loadIntervention();
    } catch (err) {
      setError('Erreur lors de la suppression de la note');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !event.target.files?.length) return;
    try {
      const file = event.target.files[0];
      await interventionService.uploadAttachment(id, file);
      setSuccess('Fichier uploadé avec succès');
      loadIntervention();
    } catch (err) {
      setError('Erreur lors de l\'upload du fichier');
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!id) return;
    try {
      await interventionService.deleteAttachment(id, attachmentId);
      setSuccess('Fichier supprimé avec succès');
      loadIntervention();
    } catch (err) {
      setError('Erreur lors de la suppression du fichier');
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      planned: { label: 'Planifiée', color: 'info' },
      in_progress: { label: 'En cours', color: 'warning' },
      completed: { label: 'Terminée', color: 'success' },
      cancelled: { label: 'Annulée', color: 'error' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Chip label={config.label} color={config.color as any} />;
  };

  const getPriorityChip = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Basse', color: 'default' },
      medium: { label: 'Moyenne', color: 'info' },
      high: { label: 'Haute', color: 'warning' },
      urgent: { label: 'Urgente', color: 'error' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Chip label={config.label} color={config.color as any} />;
  };

  if (!intervention) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Chargement...</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            Détails de l'Intervention
          </Typography>
          {(user?.role === 'ADMIN' || user?.role === 'GESTIONNAIRE') && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/interventions/${id}/edit`)}
            >
              Modifier
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Site
            </Typography>
            <Typography variant="body1">
              {intervention.site}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Type
            </Typography>
            <Typography variant="body1">
              {intervention.type}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Statut
            </Typography>
            {getStatusChip(intervention.status)}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Priorité
            </Typography>
            {getPriorityChip(intervention.priority)}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Date Prévue
            </Typography>
            <Typography variant="body1">
              {dayjs(intervention.plannedDate).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Technicien Assigné
            </Typography>
            <Typography variant="body1">
              {intervention.assignedTo || 'Non assigné'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {intervention.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <List>
              {intervention.notes.map((note: InterventionNote) => (
                <ListItem
                  key={note._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={note.content}
                    secondary={`Par ${note.createdBy} le ${dayjs(note.createdAt).format('DD/MM/YYYY HH:mm')}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Nouvelle note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                Ajouter
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Pièces Jointes
            </Typography>
            <List>
              {intervention.attachments.map((attachment: Attachment) => (
                <ListItem
                  key={attachment._id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAttachment(attachment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={attachment.filename}
                    secondary={`Uploadé par ${attachment.uploadedBy} le ${dayjs(attachment.uploadedAt).format('DD/MM/YYYY HH:mm')}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              component="label"
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{ mt: 2 }}
            >
              Upload Fichier
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InterventionDetail; 