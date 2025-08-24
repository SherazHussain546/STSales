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
    phone: string;
    services: string;
    workDone: string;
    workLeft: string;
    projectStatus: number; // Percentage, 0-100
    totalBilled: number;
    totalPaid: number;
};
