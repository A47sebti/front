import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';

interface HistoryEntry {
  id: string;
  siteId: string;
  siteName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  performedBy: string;
  timestamp: string;
  details: string;
}

const SiteHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // TODO: Fetch site history
    // fetchSiteHistory();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <AddIcon />;
      case 'update':
        return <EditIcon />;
      case 'delete':
        return <DeleteIcon />;
      case 'approve':
        return <ApproveIcon />;
      case 'reject':
        return <RejectIcon />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'primary';
      case 'update':
        return 'info';
      case 'delete':
        return 'error';
      case 'approve':
        return 'success';
      case 'reject':
        return 'error';
      default:
        return 'grey';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create':
        return 'Création';
      case 'update':
        return 'Modification';
      case 'delete':
        return 'Suppression';
      case 'approve':
        return 'Approbation';
      case 'reject':
        return 'Rejet';
      default:
        return action;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Historique des Sites
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Timeline>
          {history.map((entry) => (
            <TimelineItem key={entry.id}>
              <TimelineOppositeContent color="text.secondary">
                {entry.timestamp}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={getActionColor(entry.action)}>
                  {getActionIcon(entry.action)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" component="span">
                    {entry.siteName}
                  </Typography>
                  <Chip
                    label={getActionLabel(entry.action)}
                    color={getActionColor(entry.action)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Par {entry.performedBy}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {entry.details}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Container>
  );
};

export default SiteHistory; 