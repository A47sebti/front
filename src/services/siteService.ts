import api from './api';

export interface Site {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'active' | 'maintenance' | 'inactive';
  type: 'urban' | 'rural' | 'industrial';
  equipment: Equipment[];
  lastMaintenance: string;
  nextMaintenance: string;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  _id: string;
  name: string;
  type: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: string;
  specifications: Record<string, any>;
}

export const siteService = {
  // Obtenir la liste des sites
  getSites: async () => {
    const response = await api.get<Site[]>('/sites');
    return response.data;
  },

  // Obtenir un site par son ID
  getSiteById: async (id: string) => {
    const response = await api.get<Site>(`/sites/${id}`);
    return response.data;
  },

  // Créer un nouveau site
  createSite: async (siteData: Omit<Site, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Site>('/sites', siteData);
    return response.data;
  },

  // Mettre à jour un site
  updateSite: async (id: string, siteData: Partial<Site>) => {
    const response = await api.put<Site>(`/sites/${id}`, siteData);
    return response.data;
  },

  // Supprimer un site
  deleteSite: async (id: string) => {
    await api.delete(`/sites/${id}`);
  },

  // Ajouter un équipement à un site
  addEquipment: async (siteId: string, equipmentData: Omit<Equipment, '_id'>) => {
    const response = await api.post<Equipment>(`/sites/${siteId}/equipment`, equipmentData);
    return response.data;
  },

  // Mettre à jour un équipement
  updateEquipment: async (siteId: string, equipmentId: string, equipmentData: Partial<Equipment>) => {
    const response = await api.put<Equipment>(`/sites/${siteId}/equipment/${equipmentId}`, equipmentData);
    return response.data;
  },

  // Supprimer un équipement
  deleteEquipment: async (siteId: string, equipmentId: string) => {
    await api.delete(`/sites/${siteId}/equipment/${equipmentId}`);
  },

  // Obtenir les statistiques des sites
  getSiteStats: async () => {
    const response = await api.get<{
      total: number;
      active: number;
      maintenance: number;
      inactive: number;
      byType: Record<string, number>;
    }>('/sites/stats');
    return response.data;
  },
}; 