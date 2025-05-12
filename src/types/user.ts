export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'TECHNICIEN';
  siege: string;
  createdAt: string;
  updatedAt: string;
} 