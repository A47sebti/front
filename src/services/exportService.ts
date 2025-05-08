import api from './api';

export interface ExportOptions {
  startDate?: string;
  endDate?: string;
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
}

export const exportService = {
  // Exporter les interventions
  exportInterventions: async (options: ExportOptions) => {
    const response = await api.post<ExportResponse>('/exports/interventions', options);
    return response.data;
  },

  // Exporter l'équipement d'un site
  exportSiteEquipment: async (siteId: string, options: ExportOptions) => {
    const response = await api.get<ExportResponse>(`/exports/site/${siteId}/equipment`, {
      params: options,
    });
    return response.data;
  },

  // Exporter les performances d'un site
  exportSitePerformance: async (siteId: string, options: ExportOptions) => {
    const response = await api.get<ExportResponse>(`/exports/site/${siteId}/performance`, {
      params: options,
    });
    return response.data;
  },

  // Nettoyer les exports (admin uniquement)
  cleanupExports: async () => {
    await api.post('/exports/cleanup');
  },

  // Télécharger un fichier exporté
  downloadFile: async (downloadUrl: string, filename: string) => {
    const response = await api.get(downloadUrl, {
      responseType: 'blob',
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
}; 