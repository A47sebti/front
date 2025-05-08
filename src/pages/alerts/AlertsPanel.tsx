import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface Alert {
  id: string;
  site: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      site: 'Site A',
      type: 'error',
      message: 'Panne d\'alimentation détectée',
      timestamp: '2024-03-20 10:30:00',
      status: 'active',
    },
    {
      id: '2',
      site: 'Site B',
      type: 'warning',
      message: 'Température élevée',
      timestamp: '2024-03-20 10:25:00',
      status: 'acknowledged',
    },
    // Add more mock data as needed
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refreshing alerts...');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Alertes en Temps Réel</Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>

        <List>
          {alerts.map((alert) => (
            <ListItem
              key={alert.id}
              divider
              secondaryAction={
                <Chip
                  label={alert.status}
                  color={getStatusColor(alert.status)}
                  size="small"
                />
              }
            >
              <ListItemIcon>
                {getAlertIcon(alert.type)}
              </ListItemIcon>
              <ListItemText
                primary={alert.message}
                secondary={`${alert.site} - ${alert.timestamp}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AlertsPanel; 