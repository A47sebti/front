import React, { useState, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface PendingSite {
  id: string;
  name: string;
  type: string;
  category: string;
  location: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

const SiteValidation: React.FC = () => {
  const [pendingSites, setPendingSites] = useState<PendingSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<PendingSite | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // TODO: Fetch pending sites
    // fetchPendingSites();
  }, []);

  const handleViewDetails = (site: PendingSite) => {
    setSelectedSite(site);
    setOpenDialog(true);
  };

  const handleApprove = async (siteId: string) => {
    try {
      // TODO: Approve site
      // await approveSite(siteId);
      // Refresh list
      // fetchPendingSites();
    } catch (error) {
      console.error('Error approving site:', error);
    }
  };

  const handleReject = async (siteId: string) => {
    if (!rejectionReason) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }
    try {
      // TODO: Reject site with reason
      // await rejectSite(siteId, rejectionReason);
      setOpenDialog(false);
      setRejectionReason('');
      // Refresh list
      // fetchPendingSites();
    } catch (error) {
      console.error('Error rejecting site:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Validation des Sites
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du site</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Soumis par</TableCell>
              <TableCell>Date de soumission</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.type}</TableCell>
                <TableCell>{site.category}</TableCell>
                <TableCell>{site.location}</TableCell>
                <TableCell>{site.submittedBy}</TableCell>
                <TableCell>{site.submittedAt}</TableCell>
                <TableCell>
                  <Chip
                    label={site.status}
                    color={getStatusColor(site.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(site)}
                  >
                    <ViewIcon />
                  </IconButton>
                  {site.status === 'pending' && (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(site.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleViewDetails(site)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détails du site - {selectedSite?.name}
        </DialogTitle>
        <DialogContent>
          {selectedSite && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedSite.description}</Typography>
              </Box>

              {selectedSite.status === 'pending' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Action de validation
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Raison du rejet (si applicable)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
          {selectedSite?.status === 'pending' && (
            <>
              <Button
                color="success"
                variant="contained"
                onClick={() => handleApprove(selectedSite.id)}
              >
                Approuver
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleReject(selectedSite.id)}
              >
                Rejeter
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SiteValidation; 