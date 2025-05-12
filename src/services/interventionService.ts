import { Intervention, InterventionNote, Attachment } from '../types/intervention';
import api from './api';

export const interventionService = {
  getInterventions: async () => {
    const response = await api.get<Intervention[]>('/interventions');
    return response.data;
  },

  getInterventionsBySite: async (siteId: string) => {
    const response = await api.get<Intervention[]>(`/interventions/site/${siteId}`);
    return response.data;
  },

  getInterventionsByTechnician: async (technicianId: string) => {
    const response = await api.get<Intervention[]>(`/interventions/technician/${technicianId}`);
    return response.data;
  },

  getInterventionById: async (id: string) => {
    const response = await api.get<Intervention>(`/interventions/${id}`);
    return response.data;
  },
  
  createIntervention: async (data: Omit<Intervention, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Intervention>('/interventions', data);
    return response.data;
  },
  
  updateIntervention: async (id: string, data: Partial<Intervention>) => {
    const response = await api.put<Intervention>(`/interventions/${id}`, data);
    return response.data;
  },
  
  deleteIntervention: (id: string) => 
    api.delete(`/interventions/${id}`),
  
  // Gestion des notes
  addNote: async (interventionId: string, content: string) => {
    const response = await api.post<InterventionNote>(
      `/interventions/${interventionId}/notes`,
      { content }
    );
    return response.data;
  },
  
  deleteNote: (interventionId: string, noteId: string) => 
    api.delete(`/interventions/${interventionId}/notes/${noteId}`),
  
  // Gestion des pièces jointes
  uploadAttachment: async (interventionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Attachment>(
      `/interventions/${interventionId}/attachments`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },
  
  deleteAttachment: (interventionId: string, attachmentId: string) => 
    api.delete(`/interventions/${interventionId}/attachments/${attachmentId}`),
  
  // Statistiques
  getInterventionStats: async () => {
    const response = await api.get('/interventions/stats');
    return response.data;
  }
}; 