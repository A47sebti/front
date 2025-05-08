// Configuration de l'API
export const API_CONFIG = {
  // Ports disponibles pour le backend
  PORTS: {
    PRIMARY: 5000,
    SECONDARY: 3000,
  },
  // URL de base pour l'API
  get BASE_URL() {
    // Essayer d'abord le port principal, puis le port secondaire
    return `http://localhost:${this.PORTS.PRIMARY}/api`;
  },
  // URL de base pour les WebSockets
  get WS_URL() {
    return `ws://localhost:${this.PORTS.PRIMARY}`;
  },
  // Timeout pour les requêtes API (en millisecondes)
  TIMEOUT: 10000,
  // Intervalle de reconnexion WebSocket (en millisecondes)
  WS_RECONNECT_INTERVAL: 5000,
}; 