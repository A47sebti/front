import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

interface SiteFormData {
  name: string;
  type: string;
  category: string;
  status: string;
  location: string;
  description: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  technicalSpecs: {
    power: string;
    frequency: string;
    coverage: string;
  };
}

const siteTypes = [
  { value: 'macro', label: 'Macro' },
  { value: 'micro', label: 'Micro' },
  { value: 'pico', label: 'Pico' },
];

const siteCategories = [
  { value: 'urban', label: 'Urbain' },
  { value: 'rural', label: 'Rural' },
  { value: 'suburban', label: 'Suburbain' },
];

const initialFormData: SiteFormData = {
  name: '',
  type: '',
  category: '',
  status: 'active',
  location: '',
  description: '',
  coordinates: {
    latitude: '',
    longitude: '',
  },
  technicalSpecs: {
    power: '',
    frequency: '',
    coverage: '',
  },
};

const SiteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<SiteFormData>(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // TODO: Fetch site data if editing
      // fetchSite(id);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name?.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SiteFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // TODO: Update site
        // await updateSite(id, formData);
      } else {
        // TODO: Create site
        // await createSite(formData);
      }
      navigate('/sites');
    } catch (error) {
      setError('Une erreur est survenue lors de l\'enregistrement du site');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Modifier le site' : 'Ajouter un site'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Nom du site"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Type de site"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {siteTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {siteCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Statut"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="maintenance">En maintenance</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Localisation"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Coordonnées
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="coordinates.latitude"
                value={formData.coordinates.latitude}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="coordinates.longitude"
                value={formData.coordinates.longitude}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Spécifications techniques
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Puissance"
                name="technicalSpecs.power"
                value={formData.technicalSpecs.power}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fréquence"
                name="technicalSpecs.frequency"
                value={formData.technicalSpecs.frequency}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Couverture"
                name="technicalSpecs.coverage"
                value={formData.technicalSpecs.coverage}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/sites')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {id ? 'Modifier' : 'Ajouter'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default SiteForm; 