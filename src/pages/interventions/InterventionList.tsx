import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Intervention {
  id: string;
  siteId: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  description: string;
}

const InterventionList: React.FC = () => {
  const navigate = useNavigate();
  const [interventions] = useState<Intervention[]>([
    {
      id: '1',
      siteId: 'site1',
      type: 'Maintenance',
      status: 'completed',
      date: '2024-02-20',
      description: 'Maintenance préventive',
    },
    {
      id: '2',
      siteId: 'site2',
      type: 'Réparation',
      status: 'in_progress',
      date: '2024-02-21',
      description: 'Réparation antenne',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/interventions/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete intervention:', id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Interventions</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/interventions/new')}
        >
          Nouvelle Intervention
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow key={intervention.id}>
                <TableCell>{intervention.id}</TableCell>
                <TableCell>{intervention.siteId}</TableCell>
                <TableCell>{intervention.type}</TableCell>
                <TableCell>
                  <Chip
                    label={intervention.status}
                    color={getStatusColor(intervention.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{intervention.date}</TableCell>
                <TableCell>{intervention.description}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(intervention.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(intervention.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InterventionList; 