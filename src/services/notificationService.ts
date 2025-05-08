import api from './api';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

export const notificationService = {
  // Obtenir toutes les notifications (gestionnaires uniquement)
  getNotifications: async () => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  // Effacer toutes les notifications (gestionnaires uniquement)
  clearNotifications: async () => {
    await api.delete('/notifications');
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: string) => {
    const response = await api.put<Notification>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    const response = await api.put<Notification[]>('/notifications/read-all');
    return response.data;
  },
}; 