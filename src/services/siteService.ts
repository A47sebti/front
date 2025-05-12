import { Site, Equipment } from '../types/site';
import api from './api';
import { AxiosResponse } from 'axios';

export const siteService = {
  getSites: async (): Promise<Site[]> => {
    const response = await api.get<Site[]>('/sites');
    return response.data;
  },

  getAllSites: async (): Promise<Site[]> => {
    const response = await api.get<Site[]>('/sites/all');
    return response.data;
  },

  getSitesBySiege: async (siege: string): Promise<Site[]> => {
    const response = await api.get<Site[]>(`/sites/siege/${siege}`);
    return response.data;
  },

  getSiteById: async (id: string): Promise<Site> => {
    const response = await api.get<Site>(`/sites/${id}`);
    return response.data;
  },

  createSite: async (siteData: Omit<Site, '_id' | 'createdAt' | 'updatedAt'>): Promise<Site> => {
    const response = await api.post<Site>('/sites', siteData);
    return response.data;
  },

  updateSite: async (id: string, siteData: Partial<Site>): Promise<Site> => {
    const response = await api.put<Site>(`/sites/${id}`, siteData);
    return response.data;
  },

  deleteSite: (id: string) => 
    api.delete(`/sites/${id}`),

  updateSiteValidation: async (id: string, validationData: { 
    validationStatus: 'approved' | 'rejected';
    status?: 'active' | 'inactive' | 'maintenance';
    rejectionReason?: string;
  }): Promise<Site> => {
    const response = await api.put<Site>(`/sites/${id}/validation`, validationData);
    return response.data;
  },

  addEquipment: async (siteId: string, equipmentData: Omit<Equipment, '_id'>) => {
    const response = await api.post<Equipment>(`/sites/${siteId}/equipment`, equipmentData);
    return response.data;
  },

  removeEquipment: (siteId: string, equipmentId: string) => 
    api.delete(`/sites/${siteId}/equipment/${equipmentId}`),

  getSiteStats: async () => {
    const response = await api.get('/sites/stats');
    return response.data;
  }
};

export type { Site, Equipment }; 