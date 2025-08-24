export type Tab = 'leads' | 'outreach' | 'invoice' | 'clients' | 'socials';

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
