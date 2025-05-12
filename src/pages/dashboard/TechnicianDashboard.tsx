import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
} from '@mui/material';
import {
  Build,
  History,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';

const TechnicianDashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Technicien
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interventions du Jour
              </Typography>
              <Typography variant="h5" component="div">
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Attente
              </Typography>
              <Typography variant="h5" component="div" color="warning.main">
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Complétées Aujourd'hui
              </Typography>
              <Typography variant="h5" component="div" color="success.main">
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Temps Moyen d'Intervention
              </Typography>
              <Typography variant="h5" component="div">
                45min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section principale */}
      <Grid container spacing={3}>
        {/* Interventions assignées */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Interventions Assignées
              </Typography>
              <Button variant="contained" color="primary">
                Voir tout
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Panne réseau - Site Casa Nord"
                  secondary="Priorité: Haute | Temps estimé: 1h"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Urgent" color="error" size="small" />
                  <Button variant="contained" color="primary" size="small">
                    Démarrer
                  </Button>
                </Box>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Maintenance - Site Casa Sud"
                  secondary="Priorité: Normale | Temps estimé: 2h"
                />
                <Button variant="contained" color="primary" size="small">
                  Démarrer
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Interventions en cours */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Intervention en Cours
              </Typography>
            </Box>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Maintenance Préventive - Site Casa Est
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Démarré il y a: 30 minutes
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                  >
                    Terminer
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                  >
                    Ajouter Note
                  </Button>
                </Box>
              </CardContent>
            </Card>
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
                  startIcon={<Build />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Nouvelle Intervention
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Historique
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Rapports
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Tâches Complétées
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TechnicianDashboard; 