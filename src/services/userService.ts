import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  // Ajoutez d'autres champs selon votre modèle d'utilisateur
}

export const userService = {
  // Récupérer tous les utilisateurs
  getAll: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Récupérer un utilisateur par son ID
  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Mettre à jour un utilisateur
  update: async (id: string, user: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  // Supprimer un utilisateur
  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
}; 