import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';

interface InterventionFormData {
  siteId: string;
  type: string;
  description: string;
  diagnosis: string;
  solution: string;
  materials: string;
  duration: string;
  completed: boolean;
}

const InterventionForm: React.FC = () => {
  const [formData, setFormData] = useState<InterventionFormData>({
    siteId: '',
    type: '',
    description: '',
    diagnosis: '',
    solution: '',
    materials: '',
    duration: '',
    completed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'completed' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Rapport d'Intervention
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Site</InputLabel>
                <Select
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  label="Site"
                >
                  <MenuItem value="site1">Site 1</MenuItem>
                  <MenuItem value="site2">Site 2</MenuItem>
                  <MenuItem value="site3">Site 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'Intervention</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type d'Intervention"
                >
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="repair">Réparation</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description du Problème"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="diagnosis"
                label="Diagnostic"
                value={formData.diagnosis}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="solution"
                label="Solution Appliquée"
                value={formData.solution}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="materials"
                label="Matériel Utilisé"
                value={formData.materials}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="duration"
                label="Durée de l'Intervention"
                value={formData.duration}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="completed"
                    checked={formData.completed}
                    onChange={handleChange}
                  />
                }
                label="Intervention Terminée"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="primary">
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Enregistrer
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