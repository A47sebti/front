import api from './api';

export interface Intervention {
  _id: string;
  siteId: string;
  type: 'maintenance' | 'repair' | 'installation' | 'inspection';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  assignedTo: string;
  startDate: string;
  endDate: string | null;
  equipment: {
    id: string;
    name: string;
    type: string;
  }[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export const interventionService = {
  // Obtenir la liste des interventions
  getInterventions: async (filters?: {
    status?: Intervention['status'];
    type?: Intervention['type'];
    priority?: Intervention['priority'];
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<Intervention[]>('/interventions', { params: filters });
    return response.data;
  },

  // Obtenir une intervention par son ID
  getInterventionById: async (id: string) => {
    const response = await api.get<Intervention>(`/interventions/${id}`);
    return response.data;
  },

  // Créer une nouvelle intervention
  createIntervention: async (interventionData: Omit<Intervention, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Intervention>('/interventions', interventionData);
    return response.data;
  },

  // Mettre à jour une intervention
  updateIntervention: async (id: string, interventionData: Partial<Intervention>) => {
    const response = await api.put<Intervention>(`/interventions/${id}`, interventionData);
    return response.data;
  },

  // Supprimer une intervention
  deleteIntervention: async (id: string) => {
    await api.delete(`/interventions/${id}`);
  },

  // Ajouter une note à une intervention
  addNote: async (id: string, note: string) => {
    const response = await api.post<Intervention>(`/interventions/${id}/notes`, { note });
    return response.data;
  },

  // Mettre à jour le statut d'une intervention
  updateStatus: async (id: string, status: Intervention['status']) => {
    const response = await api.put<Intervention>(`/interventions/${id}/status`, { status });
    return response.data;
  },

  // Assigner une intervention à un technicien
  assignTechnician: async (id: string, technicianId: string) => {
    const response = await api.put<Intervention>(`/interventions/${id}/assign`, { technicianId });
    return response.data;
  },

  // Obtenir les statistiques des interventions
  getInterventionStats: async () => {
    const response = await api.get<{
      total: number;
      byStatus: Record<Intervention['status'], number>;
      byType: Record<Intervention['type'], number>;
      byPriority: Record<Intervention['priority'], number>;
      averageCompletionTime: number;
    }>('/interventions/stats');
    return response.data;
  },
}; 