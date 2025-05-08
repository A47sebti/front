import api from './api';

export interface SimulationStatus {
  isRunning: boolean;
  startTime: string | null;
  endTime: string | null;
  currentScenario: string | null;
  progress: number;
  totalScenarios: number;
  completedScenarios: number;
}

export const simulationService = {
  // Obtenir le statut de la simulation
  getStatus: async () => {
    const response = await api.get<SimulationStatus>('/simulation/status');
    return response.data;
  },

  // Démarrer la simulation (admin uniquement)
  startSimulation: async () => {
    const response = await api.post<SimulationStatus>('/simulation/start');
    return response.data;
  },

  // Arrêter la simulation (admin uniquement)
  stopSimulation: async () => {
    const response = await api.post<SimulationStatus>('/simulation/stop');
    return response.data;
  },
}; 