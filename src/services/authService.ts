import { User } from '../types/user';
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'TECHNICIEN';
  siege?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Connexion
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),

  // Inscription (uniquement pour les admins et gestionnaires)
  register: (userData: RegisterData) => 
    api.post<AuthResponse>('/auth/register', userData),

  // Déconnexion
  logout: () => 
    api.post('/auth/logout'),

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtenir l'utilisateur courant
  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: (data: Partial<User>) => 
    api.put<User>('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/change-password', data),

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: async (role: string): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      return user.role === role;
    } catch (error) {
      return false;
    }
  },

  // Vérifier si l'utilisateur a un des rôles spécifiés
  hasAnyRole: async (roles: string[]): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      return roles.includes(user.role);
    } catch (error) {
      return false;
    }
  },

  // Récupérer la liste des techniciens
  getTechnicians: () => 
    api.get<User[]>('/users/technicians'),

  // Vérifier si l'utilisateur peut créer d'autres utilisateurs
  canRegisterUsers: async (): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      return ['ADMIN', 'GESTIONNAIRE'].includes(user.role);
    } catch (error) {
      return false;
    }
  }
}; 