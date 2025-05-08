import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  Alert as MuiAlert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { alertService, Alert, AlertServiceStatus } from '../services/alertService';
import { authService } from '../services/authService';

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<AlertServiceStatus | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('all');

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = selectedSite === 'all'
        ? await alertService.getAllAlerts()
        : await alertService.getSiteAlerts(selectedSite);
      setAlerts(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async () => {
    try {
      const data = await alertService.getServiceStatus();
      setStatus(data);
    } catch (err) {
      console.error('Erreur lors du chargement du statut du service');
    }
  };

  useEffect(() => {
    if (authService.hasAnyRole(['ADMIN', 'GESTIONNAIRE'])) {
      loadAlerts();
      loadStatus();
    }
  }, [selectedSite]);

  const handleSiteChange = (event: SelectChangeEvent) => {
    setSelectedSite(event.target.value);
  };

  const handleRemoveAlert = async (alertId: string) => {
    try {
      await alertService.deleteAlert(alertId);
      setAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'alerte');
    }
  };

  const handleStartService = async () => {
    try {
      const newStatus = await alertService.startAlertService();
      setStatus(newStatus);
    } catch (err) {
      setError('Erreur lors du démarrage du service');
    }
  };

  const handleStopService = async () => {
    try {
      const newStatus = await alertService.stopAlertService();
      setStatus(newStatus);
    } catch (err) {
      setError('Erreur lors de l\'arrêt du service');
    }
  };

  const handleRefresh = () => {
    loadAlerts();
    loadStatus();
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!authService.hasAnyRole(['ADMIN', 'GESTIONNAIRE'])) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Alertes</Typography>
        <Box>
          {authService.hasRole('ADMIN') && (
            <>
              <Button
                size="small"
                startIcon={status?.isRunning ? <StopIcon /> : <PlayIcon />}
                onClick={status?.isRunning ? handleStopService : handleStartService}
                color={status?.isRunning ? 'error' : 'success'}
                sx={{ mr: 1 }}
              >
                {status?.isRunning ? 'Arrêter' : 'Démarrer'} le service
              </Button>
            </>
          )}
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {status && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Service ${status.isRunning ? 'actif' : 'inactif'}`}
            color={status.isRunning ? 'success' : 'error'}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`${status.totalAlerts} alertes`}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Dernière vérification: ${new Date(status.lastCheck).toLocaleString()}`}
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Site</InputLabel>
        <Select
          value={selectedSite}
          onChange={handleSiteChange}
          label="Site"
        >
          <MenuItem value="all">Tous les sites</MenuItem>
          {/* TODO: Ajouter la liste des sites */}
        </Select>
      </FormControl>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </MuiAlert>
      )}

      {alerts.length === 0 ? (
        <Typography color="text.secondary" align="center">
          Aucune alerte
        </Typography>
      ) : (
        <List>
          {alerts.map((alert, index) => (
            <React.Fragment key={alert._id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveAlert(alert._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={alert.severity}
                        color={getSeverityColor(alert.severity)}
                        size="small"
                      />
                      <Chip
                        label={alert.source.name}
                        variant="outlined"
                        size="small"
                      />
                      <Typography>{alert.message}</Typography>
                    </Box>
                  }
                  secondary={new Date(alert.createdAt).toLocaleString()}
                />
              </ListItem>
              {index < alerts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AlertsPanel; 