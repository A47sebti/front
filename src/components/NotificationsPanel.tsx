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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { notificationService, Notification } from '../services/notificationService';
import { authService } from '../services/authService';

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.hasRole('GESTIONNAIRE')) {
      loadNotifications();
    }
  }, []);

  const handleClearAll = async () => {
    try {
      await notificationService.clearNotifications();
      setNotifications([]);
    } catch (err) {
      setError('Erreur lors de la suppression des notifications');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const updatedNotifications = await notificationService.markAllAsRead();
      setNotifications(updatedNotifications);
    } catch (err) {
      setError('Erreur lors du marquage des notifications');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? updatedNotification : n))
      );
    } catch (err) {
      setError('Erreur lors du marquage de la notification');
    }
  };

  if (!authService.hasRole('GESTIONNAIRE')) {
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
    <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Notifications</Typography>
        <Box>
          <Button
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
            sx={{ mr: 1 }}
          >
            Tout marquer comme lu
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Tout effacer
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Typography color="text.secondary" align="center">
          Aucune notification
        </Typography>
      ) : (
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={notification.read}
                  >
                    <CheckIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                  sx={{
                    opacity: notification.read ? 0.7 : 1,
                    '& .MuiListItemText-primary': {
                      color: notification.read ? 'text.secondary' : 'text.primary',
                    },
                  }}
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NotificationsPanel; 