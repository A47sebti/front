import api from './api';

export interface Alert {
  _id: string;
  siteId: string;
  type: 'performance' | 'security' | 'maintenance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  message: string;
  source: {
    type: string;
    id: string;
    name: string;
  };
  metrics?: {
    name: string;
    value: number;
    threshold: number;
  }[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AlertServiceStatus {
  isRunning: boolean;
  lastCheck: string;
  totalAlerts: number;
}

export const alertService = {
  // Obtenir la liste des alertes
  getAlerts: async (filters?: {
    status?: Alert['status'];
    type?: Alert['type'];
    severity?: Alert['severity'];
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<Alert[]>('/alerts', { params: filters });
    return response.data;
  },

  // Obtenir une alerte par son ID
  getAlertById: async (id: string) => {
    const response = await api.get<Alert>(`/alerts/${id}`);
    return response.data;
  },

  // Créer une nouvelle alerte
  createAlert: async (alertData: Omit<Alert, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Alert>('/alerts', alertData);
    return response.data;
  },

  // Mettre à jour une alerte
  updateAlert: async (id: string, alertData: Partial<Alert>) => {
    const response = await api.put<Alert>(`/alerts/${id}`, alertData);
    return response.data;
  },

  // Supprimer une alerte
  deleteAlert: async (id: string) => {
    await api.delete(`/alerts/${id}`);
  },

  // Marquer une alerte comme résolue
  resolveAlert: async (id: string) => {
    const response = await api.put<Alert>(`/alerts/${id}/resolve`);
    return response.data;
  },

  // Marquer une alerte comme acquittée
  acknowledgeAlert: async (id: string) => {
    const response = await api.put<Alert>(`/alerts/${id}/acknowledge`);
    return response.data;
  },

  // Obtenir les statistiques des alertes
  getAlertStats: async () => {
    const response = await api.get<{
      total: number;
      active: number;
      bySeverity: Record<Alert['severity'], number>;
      byType: Record<Alert['type'], number>;
      byStatus: Record<Alert['status'], number>;
      averageResolutionTime: number;
    }>('/alerts/stats');
    return response.data;
  },

  // S'abonner aux alertes en temps réel
  subscribeToAlerts: (callback: (alert: Alert) => void) => {
    const ws = new WebSocket('ws://localhost:5000/alerts');
    
    ws.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data);
        callback(alert);
      } catch (error) {
        console.error('Erreur lors du parsing des données WebSocket:', error);
      }
    };

    return () => {
      ws.close();
    };
  },

  // Obtenir toutes les alertes (admin et gestionnaire)
  getAllAlerts: async () => {
    const response = await api.get<Alert[]>('/alerts');
    return response.data;
  },

  // Obtenir les alertes d'un site spécifique (admin et gestionnaire)
  getSiteAlerts: async (siteId: string) => {
    const response = await api.get<Alert[]>(`/alerts/site/${siteId}`);
    return response.data;
  },

  // Supprimer une alerte (admin et gestionnaire)
  removeAlert: async (alertKey: string) => {
    await api.delete(`/alerts/${alertKey}`);
  },

  // Obtenir le statut du service d'alertes (admin et gestionnaire)
  getServiceStatus: async () => {
    const response = await api.get<AlertServiceStatus>('/alerts/status');
    return response.data;
  },

  // Démarrer le service d'alertes (admin uniquement)
  startAlertService: async () => {
    const response = await api.post<AlertServiceStatus>('/alerts/start');
    return response.data;
  },

  // Arrêter le service d'alertes (admin uniquement)
  stopAlertService: async () => {
    const response = await api.post<AlertServiceStatus>('/alerts/stop');
    return response.data;
  },
}; 