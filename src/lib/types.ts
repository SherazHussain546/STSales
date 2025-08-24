export type Tab = 'leads' | 'outreach' | 'invoice' | 'clients';

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
    services: string[];
    totalBilled: number;
    totalPaid: number;
    projectStatus: number; // Percentage, 0-100
};
