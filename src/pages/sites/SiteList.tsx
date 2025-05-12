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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { siteService } from '../../services/siteService';
import { useAuth } from '../../context/AuthContext';

interface Site {
  _id: string;
  name: string;
  location: {
    city: string;
    address: string;
  };
  type: string;
  status: string;
  validationStatus: string;
  siege: string;
  createdBy: string;
}

const SiteList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isGestionnaire = user?.role === 'GESTIONNAIRE';

  const loadSites = async () => {
    try {
      let sitesList: Site[] = [];
      if (isAdmin) {
        sitesList = await siteService.getAllSites();
      } else if (isGestionnaire && user?.siege) {
        sitesList = await siteService.getSitesBySiege(user.siege);
      }
      setSites(sitesList);
    } catch (err) {
      setError('Erreur lors du chargement des sites');
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, [user]);

  const handleApprove = async (siteId: string) => {
    try {
      await siteService.updateSiteValidation(siteId, {
        validationStatus: 'approved',
        status: 'active'
      });
      setSuccess('Site approuvé avec succès');
      loadSites();
    } catch (err) {
      setError('Erreur lors de l\'approbation du site');
    }
  };

  const handleReject = async () => {
    if (!selectedSite) return;
    try {
      await siteService.updateSiteValidation(selectedSite._id, {
        validationStatus: 'rejected',
        rejectionReason
      });
      setSuccess('Site rejeté avec succès');
      setOpenRejectDialog(false);
      setRejectionReason('');
      setSelectedSite(null);
      loadSites();
    } catch (err) {
      setError('Erreur lors du rejet du site');
    }
  };

  const openRejectDialogHandler = (site: Site) => {
    setSelectedSite(site);
    setOpenRejectDialog(true);
  };

  const getStatusChip = (status: string, validationStatus: string) => {
    if (validationStatus === 'pending') {
      return <Chip label="En attente" color="warning" />;
    }
    if (validationStatus === 'rejected') {
      return <Chip label="Rejeté" color="error" />;
    }
    switch (status) {
      case 'active':
        return <Chip label="Actif" color="success" />;
      case 'inactive':
        return <Chip label="Inactif" color="error" />;
      case 'maintenance':
        return <Chip label="Maintenance" color="info" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Typography>Chargement...</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">
              Sites Mobiles
            </Typography>
            {(isAdmin || isGestionnaire) && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/sites/new')}
              >
                {isAdmin ? 'Ajouter un Site' : 'Proposer un Site'}
              </Button>
            )}
          </Box>

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

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Ville</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Statut</TableCell>
                  {isAdmin && <TableCell>Siège</TableCell>}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site._id}>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.location.city}</TableCell>
                    <TableCell>{site.type}</TableCell>
                    <TableCell>
                      {getStatusChip(site.status, site.validationStatus)}
                    </TableCell>
                    {isAdmin && <TableCell>{site.siege}</TableCell>}
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/sites/${site._id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                      
                      {((isAdmin) || (isGestionnaire && site.createdBy === user?.id)) && (
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/sites/${site._id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}

                      {isAdmin && site.validationStatus === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(site._id)}
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => openRejectDialogHandler(site)}
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog de rejet */}
          <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
            <DialogTitle>Motif du rejet</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Raison du rejet"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRejectDialog(false)}>Annuler</Button>
              <Button onClick={handleReject} color="error">
                Rejeter
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default SiteList; 