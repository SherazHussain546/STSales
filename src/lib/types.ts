export type Tab = 'leads' | 'outreach' | 'invoice' | 'clients' | 'socials' | 'blog' | 'analytics' | 'saved';

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
};
