export interface Intervention {
  _id: string;
  site: string;
  type: 'maintenance' | 'repair' | 'installation' | 'inspection';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  plannedDate: string;
  completedDate?: string;
  assignedTo: string;
  createdBy: string;
  notes: InterventionNote[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface InterventionNote {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Attachment {
  _id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
} 