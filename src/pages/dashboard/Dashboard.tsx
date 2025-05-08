import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { monitoringService, MonitoringStatus, SiteMetrics } from '../../services/monitoringService';
import { simulationService, SimulationStatus } from '../../services/simulationService';
import { siteService, Site } from '../../services/siteService';
import { authService } from '../../services/authService';
import { initializeWebSocket, closeWebSocket } from '../../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [siteMetrics, setSiteMetrics] = useState<SiteMetrics | null>(null);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    loadStatuses();
    loadSites();

    // Initialiser la connexion WebSocket
    initializeWebSocket((data) => {
      if (data.type === 'monitoring') {
        setMonitoringStatus(data.status);
      } else if (data.type === 'simulation') {
        setSimulationStatus(data.status);
      } else if (data.type === 'site_metrics' && data.siteId === selectedSite) {
        setSiteMetrics(data.metrics);
      }
    });

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedSite) {
      loadSiteMetrics(selectedSite);
    }
  }, [selectedSite]);

  const loadSites = async () => {
    try {
      const data = await siteService.getSites();
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0]._id);
      }
    } catch (err) {
      setError('Erreur lors du chargement des sites');
    }
  };

  const handleSiteChange = (event: SelectChangeEvent<string>) => {
    setSelectedSite(event.target.value);
  };

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const [monitoringData, simulationData] = await Promise.all([
        monitoringService.getServiceStatus(),
        simulationService.getStatus(),
      ]);
      setMonitoringStatus(monitoringData);
      setSimulationStatus(simulationData);
    } catch (err) {
      setError('Erreur lors du chargement des statuts');
    } finally {
      setLoading(false);
    }
  };

  const loadSiteMetrics = async (siteId: string) => {
    try {
      setLoading(true);
      const data = await monitoringService.getSiteMetrics(siteId);
      setSiteMetrics(data);
    } catch (err) {
      setError('Erreur lors du chargement des métriques du site');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMonitoring = async () => {
    try {
      setLoading(true);
      await monitoringService.startMonitoring();
      await loadStatuses();
    } catch (err) {
      setError('Erreur lors du démarrage du monitoring');
    } finally {
      setLoading(false);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      setLoading(true);
      await monitoringService.stopMonitoring();
      await loadStatuses();
    } catch (err) {
      setError('Erreur lors de l\'arrêt du monitoring');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = async () => {
    try {
      setLoading(true);
      await simulationService.startSimulation();
      await loadStatuses();
    } catch (err) {
      setError('Erreur lors du démarrage de la simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleStopSimulation = async () => {
    try {
      setLoading(true);
      await simulationService.stopSimulation();
      await loadStatuses();
    } catch (err) {
      setError('Erreur lors de l\'arrêt de la simulation');
    } finally {
      setLoading(false);
    }
  };

  if (!authService.hasAnyRole(['ADMIN', 'GESTIONNAIRE'])) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sélecteur de site */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Site</InputLabel>
              <Select
                value={selectedSite}
                onChange={handleSiteChange}
                label="Site"
              >
                {sites.map((site) => (
                  <MenuItem key={site._id} value={site._id}>
                    {site.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Statut du service de monitoring */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statut du Monitoring
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : monitoringStatus ? (
              <>
                <Typography>
                  Service: {monitoringStatus.isRunning ? 'En cours' : 'Arrêté'}
                </Typography>
                <Typography>
                  Dernière vérification: {new Date(monitoringStatus.lastCheck).toLocaleString()}
                </Typography>
                <Typography>
                  Sites surveillés: {monitoringStatus.totalSitesMonitored}
                </Typography>
                <Typography>
                  Alertes actives: {monitoringStatus.totalAlerts}
                </Typography>
                {authService.hasRole('ADMIN') && (
                  <Box sx={{ mt: 2 }}>
                    {monitoringStatus.isRunning ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleStopMonitoring}
                        disabled={loading}
                      >
                        Arrêter le monitoring
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartMonitoring}
                        disabled={loading}
                      >
                        Démarrer le monitoring
                      </Button>
                    )}
                  </Box>
                )}
              </>
            ) : null}
          </Paper>
        </Grid>

        {/* Statut de la simulation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statut de la Simulation
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : simulationStatus ? (
              <>
                <Typography>
                  Simulation: {simulationStatus.isRunning ? 'En cours' : 'Arrêtée'}
                </Typography>
                {simulationStatus.isRunning && (
                  <>
                    <Typography>
                      Scénario actuel: {simulationStatus.currentScenario}
                    </Typography>
                    <Typography>
                      Progression: {simulationStatus.completedScenarios} / {simulationStatus.totalScenarios}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={simulationStatus.progress}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  </>
                )}
                {authService.hasRole('ADMIN') && (
                  <Box sx={{ mt: 2 }}>
                    {simulationStatus.isRunning ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleStopSimulation}
                        disabled={loading}
                      >
                        Arrêter la simulation
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartSimulation}
                        disabled={loading}
                      >
                        Démarrer la simulation
                      </Button>
                    )}
                  </Box>
                )}
              </>
            ) : null}
          </Paper>
        </Grid>

        {/* Métriques du site */}
        {siteMetrics && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Métriques du Site
              </Typography>
              <Typography>
                Site: {siteMetrics.siteName}
              </Typography>
              <Typography>
                Statut: {siteMetrics.status}
              </Typography>
              <Typography>
                Uptime: {siteMetrics.uptime}%
              </Typography>
              <Typography>
                CPU: {siteMetrics.performance.cpu}%
              </Typography>
              <Typography>
                Mémoire: {siteMetrics.performance.memory}%
              </Typography>
              <Typography>
                Bande passante: {siteMetrics.performance.bandwidth} Mbps
              </Typography>
              <Typography>
                Dernière mise à jour: {new Date(siteMetrics.lastUpdate).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Graphique de performance */}
        {siteMetrics && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      {
                        name: 'CPU',
                        value: siteMetrics.performance.cpu,
                      },
                      {
                        name: 'Mémoire',
                        value: siteMetrics.performance.memory,
                      },
                      {
                        name: 'Bande passante',
                        value: siteMetrics.performance.bandwidth,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard; 