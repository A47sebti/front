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
  SelectChangeEvent,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { siteService, Site, Equipment } from '../../services/siteService';
import { authService } from '../../services/authService';

const SiteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Site, '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    location: {
      address: '',
      city: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    type: 'urban',
    status: 'active',
    equipment: [],
    lastMaintenance: new Date().toISOString(),
    nextMaintenance: new Date().toISOString()
  });

  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, '_id'>>({
    name: '',
    type: '',
    model: '',
    status: 'online',
    lastCheck: new Date().toISOString(),
    specifications: {}
  });

  const isAdmin = authService.hasRole('ADMIN');
  const isGestionnaire = authService.hasRole('GESTIONNAIRE');

  useEffect(() => {
    if (id) {
      // Charger les données du site si on est en mode édition
      const loadSite = async () => {
        try {
          const site = await siteService.getSiteById(id);
          setFormData({
            name: site.name,
            location: site.location,
            type: site.type,
            status: site.status,
            equipment: site.equipment,
            lastMaintenance: site.lastMaintenance,
            nextMaintenance: site.nextMaintenance
          });
        } catch (err) {
          setError('Erreur lors du chargement du site');
        }
      };
      loadSite();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEquipmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setNewEquipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEquipment = async () => {
    if (!id) return;
    try {
      const equipment = await siteService.addEquipment(id, newEquipment);
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, equipment],
      }));
      setNewEquipment({
        name: '',
        type: '',
        model: '',
        status: 'online',
        lastCheck: new Date().toISOString(),
        specifications: {}
      });
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'équipement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await siteService.updateSite(id, formData);
      } else {
        await siteService.createSite(formData);
      }
      navigate('/sites');
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du site');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Modifier le Site' : 'Nouveau Site Mobile'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="name"
                label="Nom du Site"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="location.address"
                label="Adresse"
                value={formData.location.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="location.city"
                label="Ville"
                value={formData.location.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type de Site</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type de Site"
                >
                  <MenuItem value="urban">Urbain</MenuItem>
                  <MenuItem value="rural">Rural</MenuItem>
                  <MenuItem value="industrial">Industriel</MenuItem>
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
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="maintenance">En Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {id && (isAdmin || isGestionnaire) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Équipements
                  </Typography>
                  <List>
                    {formData.equipment.map((equipment) => (
                      <ListItem
                        key={equipment._id}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={equipment.name}
                          secondary={`Type: ${equipment.type} - Modèle: ${equipment.model} - Statut: ${equipment.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Ajouter un Équipement
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Nom de l'Équipement"
                        value={newEquipment.name}
                        onChange={handleEquipmentChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        name="model"
                        label="Modèle"
                        value={newEquipment.model}
                        onChange={handleEquipmentChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Type d'Équipement</InputLabel>
                        <Select
                          name="type"
                          value={newEquipment.type}
                          onChange={handleEquipmentChange}
                          label="Type d'Équipement"
                        >
                          <MenuItem value="antenne">Antenne</MenuItem>
                          <MenuItem value="routeur">Routeur</MenuItem>
                          <MenuItem value="serveur">Serveur</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Statut</InputLabel>
                        <Select
                          name="status"
                          value={newEquipment.status}
                          onChange={handleEquipmentChange}
                          label="Statut"
                        >
                          <MenuItem value="online">En ligne</MenuItem>
                          <MenuItem value="offline">Hors ligne</MenuItem>
                          <MenuItem value="maintenance">En maintenance</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddEquipment}
                        fullWidth
                      >
                        Ajouter
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/sites')}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {id ? 'Modifier' : 'Enregistrer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SiteForm; 