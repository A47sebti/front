import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
  Grid,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface Site {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  location: string;
  lastMaintenance: string;
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

const SiteList: React.FC = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    // TODO: Fetch sites from API
    // fetchSites();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (siteId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      try {
        // TODO: Delete site
        // await deleteSite(siteId);
        // Refresh sites list
        // fetchSites();
      } catch (error) {
        console.error('Error deleting site:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sites Mobiles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/sites/new')}
        >
          Ajouter un site
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Rechercher"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Type de site"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Tous</MenuItem>
              {siteTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Catégorie"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Toutes</MenuItem>
              {siteCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Statut"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="maintenance">En maintenance</MenuItem>
              <MenuItem value="inactive">Inactif</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Dernière maintenance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.type}</TableCell>
                <TableCell>{site.category}</TableCell>
                <TableCell>
                  <Chip
                    label={site.status}
                    color={getStatusColor(site.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{site.location}</TableCell>
                <TableCell>{site.lastMaintenance}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/sites/${site.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/sites/${site.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(site.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SiteList; 