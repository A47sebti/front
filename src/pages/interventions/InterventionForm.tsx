import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { interventionService } from '../../services/interventionService';
import { siteService } from '../../services/siteService';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Intervention } from '../../types/intervention';
import { Site } from '../../types/site';
import { User } from '../../types/user';
import dayjs from 'dayjs';

const InterventionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  
  const [formData, setFormData] = useState<Omit<Intervention, '_id' | 'createdAt' | 'updatedAt'>>({
    site: '',
    type: 'maintenance',
    status: 'planned',
    priority: 'medium',
    description: '',
    plannedDate: dayjs().add(1, 'day').toISOString(),
    assignedTo: '',
    createdBy: user?.id || '',
    notes: [],
    attachments: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les sites
        const sitesData = await siteService.getSites();
        setSites(sitesData);

        // Charger les techniciens
        const techData = await authService.getTechnicians();
        setTechnicians(techData.data);

        // Si on est en mode édition, charger l'intervention
        if (id) {
          const intervention = await interventionService.getInterventionById(id);
          setFormData({
            ...intervention,
            plannedDate: dayjs(intervention.plannedDate).toISOString()
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };
    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        plannedDate: date.toISOString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await interventionService.updateIntervention(id, formData);
        setSuccess('Intervention mise à jour avec succès');
      } else {
        await interventionService.createIntervention(formData);
        setSuccess('Intervention créée avec succès');
      }
      setTimeout(() => {
        navigate('/interventions');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'intervention');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Modifier l\'Intervention' : 'Nouvelle Intervention'}
        </Typography>

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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Site</InputLabel>
                <Select
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  label="Site"
                >
                  {sites.map((site) => (
                    <MenuItem key={site._id} value={site._id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="repair">Réparation</MenuItem>
                  <MenuItem value="installation">Installation</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Priorité</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priorité"
                >
                  <MenuItem value="low">Basse</MenuItem>
                  <MenuItem value="medium">Moyenne</MenuItem>
                  <MenuItem value="high">Haute</MenuItem>
                  <MenuItem value="urgent">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                >
                  <MenuItem value="planned">Planifiée</MenuItem>
                  <MenuItem value="in_progress">En cours</MenuItem>
                  <MenuItem value="completed">Terminée</MenuItem>
                  <MenuItem value="cancelled">Annulée</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Date Prévue"
                value={dayjs(formData.plannedDate)}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Technicien Assigné</InputLabel>
                <Select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  label="Technicien Assigné"
                >
                  <MenuItem value="">Non assigné</MenuItem>
                  {technicians.map((tech) => (
                    <MenuItem key={tech._id} value={tech._id}>
                      {tech.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/interventions')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {id ? 'Mettre à jour' : 'Créer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default InterventionForm; 