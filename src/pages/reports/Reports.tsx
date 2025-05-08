import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { exportService, ExportOptions } from '../../services/exportService';
import { authService } from '../../services/authService';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exportType, setExportType] = useState<string>('interventions');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('');

  const handleExportTypeChange = (event: SelectChangeEvent) => {
    setExportType(event.target.value);
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setFormat(event.target.value as 'pdf' | 'excel' | 'csv');
  };

  const handleSiteChange = (event: SelectChangeEvent) => {
    setSelectedSite(event.target.value);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const options: ExportOptions = {
        format,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      };

      let response;
      switch (exportType) {
        case 'interventions':
          response = await exportService.exportInterventions(options);
          break;
        case 'equipment':
          if (!selectedSite) {
            throw new Error('Veuillez sélectionner un site');
          }
          response = await exportService.exportSiteEquipment(selectedSite, options);
          break;
        case 'performance':
          if (!selectedSite) {
            throw new Error('Veuillez sélectionner un site');
          }
          response = await exportService.exportSitePerformance(selectedSite, options);
          break;
        default:
          throw new Error('Type d\'export non valide');
      }

      await exportService.downloadFile(response.downloadUrl, response.filename);
      setSuccess('Export réussi');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setLoading(true);
      setError('');
      await exportService.cleanupExports();
      setSuccess('Nettoyage des exports réussi');
    } catch (err) {
      setError('Erreur lors du nettoyage des exports');
    } finally {
      setLoading(false);
    }
  };

  if (!authService.hasAnyRole(['ADMIN', 'GESTIONNAIRE'])) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Rapports et Exports
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type d'export</InputLabel>
              <Select
                value={exportType}
                onChange={handleExportTypeChange}
                label="Type d'export"
              >
                <MenuItem value="interventions">Interventions</MenuItem>
                <MenuItem value="equipment">Équipement du site</MenuItem>
                <MenuItem value="performance">Performance du site</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {(exportType === 'equipment' || exportType === 'performance') && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Site</InputLabel>
                <Select
                  value={selectedSite}
                  onChange={handleSiteChange}
                  label="Site"
                >
                  <MenuItem value="">Sélectionner un site</MenuItem>
                  {/* TODO: Ajouter la liste des sites */}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={format}
                onChange={handleFormatChange}
                label="Format"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {authService.hasRole('ADMIN') && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCleanup}
                  disabled={loading}
                >
                  Nettoyer les exports
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleExport}
                disabled={loading || (exportType !== 'interventions' && !selectedSite)}
              >
                {loading ? <CircularProgress size={24} /> : 'Exporter'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reports; 