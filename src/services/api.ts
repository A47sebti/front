import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const WS_BASE_URL = 'ws://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si le token est invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

let ws: WebSocket | null = null;
let wsCallbacks: ((data: any) => void)[] = [];

export const initializeWebSocket = (callback: (data: any) => void) => {
  wsCallbacks.push(callback);

  if (!ws) {
    ws = new WebSocket(`${WS_BASE_URL}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        wsCallbacks.forEach(cb => cb(data));
      } catch (error) {
        console.error('Erreur lors du parsing des données WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
      // Tentative de reconnexion après 5 secondes
      setTimeout(() => {
        if (wsCallbacks.length > 0) {
          initializeWebSocket(callback);
        }
      }, 5000);
    };
  }

  return () => {
    wsCallbacks = wsCallbacks.filter(cb => cb !== callback);
    if (wsCallbacks.length === 0 && ws) {
      ws.close();
      ws = null;
    }
  };
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
  wsCallbacks = [];
};

export default api; 