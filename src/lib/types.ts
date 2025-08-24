export type Tab = 'leads' | 'outreach' | 'invoice';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};
