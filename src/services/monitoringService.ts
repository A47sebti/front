import api from './api';

export interface MonitoringStatus {
  isRunning: boolean;
  lastCheck: string;
  totalSitesMonitored: number;
  totalAlerts: number;
}

export interface SiteMetrics {
  siteId: string;
  siteName: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  performance: {
    cpu: number;
    memory: number;
    bandwidth: number;
  };
  lastUpdate: string;
}

export interface EquipmentMetrics {
  equipmentId: string;
  equipmentName: string;
  status: 'online' | 'offline' | 'maintenance';
  metrics: {
    temperature: number;
    power: number;
    signal: number;
  };
  lastUpdate: string;
}

export const monitoringService = {
  // Obtenir le statut du service de monitoring
  getServiceStatus: async () => {
    const response = await api.get<MonitoringStatus>('/monitoring/status');
    return response.data;
  },

  // Obtenir les métriques d'un site
  getSiteMetrics: async (siteId: string) => {
    const response = await api.get<SiteMetrics>(`/monitoring/site/${siteId}`);
    return response.data;
  },

  // Obtenir les métriques d'un équipement
  getEquipmentMetrics: async (siteId: string, equipmentId: string) => {
    const response = await api.get<EquipmentMetrics>(
      `/monitoring/equipment/${siteId}/${equipmentId}`
    );
    return response.data;
  },

  // Démarrer le service de monitoring (admin uniquement)
  startMonitoring: async () => {
    const response = await api.post<MonitoringStatus>('/monitoring/start');
    return response.data;
  },

  // Arrêter le service de monitoring (admin uniquement)
  stopMonitoring: async () => {
    const response = await api.post<MonitoringStatus>('/monitoring/stop');
    return response.data;
  },
}; 