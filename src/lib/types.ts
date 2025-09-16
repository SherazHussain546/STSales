export type Tab = 'leads' | 'outreach' | 'invoice' | 'clients' | 'socials' | 'blog' | 'analytics' | 'saved' | 'contact';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type Client = {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    services: string;
    totalBilled: number;
    totalPaid: number;
};

export type SavedLead = {
  id: string;
  userId: string;
  companyName: string;
  summary: string;
  painPoints: string;
  techNeeds: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  notes?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  status: 'new' | 'read';
};
