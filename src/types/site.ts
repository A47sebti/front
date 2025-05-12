export interface Site {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  type: 'urban' | 'rural' | 'industrial';
  status: 'active' | 'inactive' | 'maintenance';
  validationStatus: 'pending' | 'approved' | 'rejected';
  equipment: Equipment[];
  lastMaintenance: string;
  nextMaintenance: string;
  createdBy: string;
  siege: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Equipment {
  _id?: string;
  name: string;
  type: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: string;
  specifications: Record<string, any>;
}

export interface User {
  id: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'TECHNICIEN';
  siege: string;
  name: string;
  email: string;
} 