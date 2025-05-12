import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Assignment as AssignIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { interventionService } from '../../services/interventionService';
import { useAuth } from '../../context/AuthContext';
import { Intervention } from '../../types/intervention';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const InterventionList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    startDate: null as dayjs.Dayjs | null,
    endDate: null as dayjs.Dayjs | null,
  });

  const loadInterventions = async () => {
    try {
      let data: Intervention[] = [];
      if (user?.role === 'TECHNICIEN' && user?._id) {
        data = await interventionService.getInterventionsByTechnician(user._id);
      } else {
        data = await interventionService.getInterventions();
      }
      setInterventions(data);
    } catch (err) {
      console.error('Erreur lors du chargement des interventions:', err);
      setError('Erreur lors du chargement des interventions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, [user]);

  const getStatusChip = (status: Intervention['status']) => {
    const statusConfig = {
      planned: { label: 'Planifiée', color: 'info' },
      in_progress: { label: 'En cours', color: 'warning' },
      completed: { label: 'Terminée', color: 'success' },
      cancelled: { label: 'Annulée', color: 'error' },
    } as const;
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} />;
  };

  const getPriorityChip = (priority: Intervention['priority']) => {
    const priorityConfig = {
      low: { label: 'Basse', color: 'default' },
      medium: { label: 'Moyenne', color: 'info' },
      high: { label: 'Haute', color: 'warning' },
      urgent: { label: 'Urgente', color: 'error' },
    } as const;
    const config = priorityConfig[priority];
    return <Chip label={config.label} color={config.color} />;
  };

  const filteredInterventions = interventions.filter((intervention) => {
    if (filters.status && intervention.status !== filters.status) return false;
    if (filters.type && intervention.type !== filters.type) return false;
    if (filters.priority && intervention.priority !== filters.priority) return false;
    if (filters.startDate && dayjs(intervention.plannedDate).isBefore(filters.startDate, 'day')) return false;
    if (filters.endDate && dayjs(intervention.plannedDate).isAfter(filters.endDate, 'day')) return false;
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Interventions
        </Typography>
        {user?.role !== 'TECHNICIEN' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/interventions/new')}
          >
            Nouvelle Intervention
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Statut"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="planned">Planifiée</MenuItem>
              <MenuItem value="in_progress">En cours</MenuItem>
              <MenuItem value="completed">Terminée</MenuItem>
              <MenuItem value="cancelled">Annulée</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="repair">Réparation</MenuItem>
              <MenuItem value="installation">Installation</MenuItem>
              <MenuItem value="inspection">Inspection</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Priorité"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <MenuItem value="">Toutes</MenuItem>
              <MenuItem value="low">Basse</MenuItem>
              <MenuItem value="medium">Moyenne</MenuItem>
              <MenuItem value="high">Haute</MenuItem>
              <MenuItem value="urgent">Urgente</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date début"
              value={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date fin"
              value={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Chargement...</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Date Prévue</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Technicien</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInterventions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune intervention trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredInterventions.map((intervention) => (
                  <TableRow key={intervention._id}>
                    <TableCell>{intervention.type}</TableCell>
                    <TableCell>{intervention.site}</TableCell>
                    <TableCell>{dayjs(intervention.plannedDate).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{getPriorityChip(intervention.priority)}</TableCell>
                    <TableCell>{getStatusChip(intervention.status)}</TableCell>
                    <TableCell>{intervention.assignedTo || 'Non assigné'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/interventions/${intervention._id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                      {(user?.role === 'ADMIN' || user?.role === 'GESTIONNAIRE') && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/interventions/${intervention._id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/interventions/${intervention._id}/assign`)}
                          >
                            <AssignIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default InterventionList; 