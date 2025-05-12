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
  Engineering,
  AddLocation,
  Warning,
  Assignment,
} from '@mui/icons-material';

const ManagerDashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Gestionnaire - Siège Casablanca
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sites de mon siège
              </Typography>
              <Typography variant="h5" component="div">
                45
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
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Techniciens Actifs
              </Typography>
              <Typography variant="h5" component="div">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interventions en cours
              </Typography>
              <Typography variant="h5" component="div">
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section principale */}
      <Grid container spacing={3}>
        {/* Interventions en cours */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Interventions en cours
              </Typography>
              <Button variant="contained" color="primary">
                Voir tout
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Panne réseau - Site Casa Nord"
                  secondary="Technicien: Mohammed | Durée: 45min"
                />
                <Chip label="En cours" color="warning" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Maintenance - Site Casa Sud"
                  secondary="Technicien: Ahmed | Durée: 1h20"
                />
                <Chip label="En attente" color="info" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Alertes du siège */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Alertes du Siège
              </Typography>
              <Button variant="contained" color="primary">
                Voir tout
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Alerte critique - Site Casa Est"
                  secondary="Panne d'alimentation détectée"
                  sx={{ color: 'error.main' }}
                />
                <Button color="primary" size="small">
                  Assigner
                </Button>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Alerte mineure - Site Casa Ouest"
                  secondary="Performance réseau dégradée"
                />
                <Button color="primary" size="small">
                  Assigner
                </Button>
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
                  startIcon={<Engineering />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Gérer Techniciens
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  startIcon={<AddLocation />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Proposer Site
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
                  startIcon={<Assignment />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  Assigner Tâches
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard; 