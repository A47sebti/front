import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Assessment,
  People,
  Place,
  Warning,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Administrateur
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sites
              </Typography>
              <Typography variant="h5" component="div">
                150
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sites en Panne
              </Typography>
              <Typography variant="h5" component="div" color="error">
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gestionnaires
              </Typography>
              <Typography variant="h5" component="div">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Techniciens
              </Typography>
              <Typography variant="h5" component="div">
                45
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section principale */}
      <Grid container spacing={3}>
        {/* Sites en attente de validation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Sites en Attente de Validation
              </Typography>
              <Button variant="contained" color="primary">
                Voir tout
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Site Casablanca Nord"
                  secondary="Proposé par: Gestionnaire Casa"
                />
                <Button color="success" sx={{ mr: 1 }}>
                  Valider
                </Button>
                <Button color="error">
                  Rejeter
                </Button>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Site Rabat Sud"
                  secondary="Proposé par: Gestionnaire Rabat"
                />
                <Button color="success" sx={{ mr: 1 }}>
                  Valider
                </Button>
                <Button color="error">
                  Rejeter
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Alertes récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Alertes Récentes
              </Typography>
              <Button variant="contained" color="primary">
                Voir tout
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Panne réseau - Site Marrakech"
                  secondary="Il y a 5 minutes"
                  sx={{ color: 'error.main' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Maintenance planifiée - Site Tanger"
                  secondary="Il y a 15 minutes"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Actions rapides */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actions Rapides
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Gérer Utilisateurs
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<Place />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Ajouter Site
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<Warning />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Voir Alertes
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Rapports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 