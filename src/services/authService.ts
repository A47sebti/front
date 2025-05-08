import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'TECHNICIEN';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authService = {
  // Connexion
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  // Inscription (uniquement pour les admins et gestionnaires)
  register: async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtenir l'utilisateur courant
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: (role: string) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  // Vérifier si l'utilisateur a un des rôles spécifiés
  hasAnyRole: (roles: string[]) => {
    const user = authService.getCurrentUser();
    return roles.includes(user?.role);
  },

  // Vérifier si l'utilisateur peut créer des comptes
  canRegisterUsers: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN' || user?.role === 'GESTIONNAIRE';
  },
}; 