'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, XCircle, Download } from 'lucide-react';
import type { LineItem } from '@/lib/types';
import { Logo } from './logo';

const SYNC_SERVICES = [
    { name: 'AI Chatbot Integration', rate: 5000 },
    { name: 'Cloud Migration', rate: 10000 },
    { name: 'Custom API Development', rate: 7500 },
    { name: 'UX/UI Design System', rate: 8000 },
];

export function InvoiceGenerator() {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [taxRate, setTaxRate] = useState(0);

    const addLineItem = () => {
        setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, price: 0 }]);
    };
    
    const addPresetLineItem = (serviceName: string) => {
        const service = SYNC_SERVICES.find(s => s.name === serviceName);
        if (service) {
            setLineItems([...lineItems, { id: crypto.randomUUID(), description: service.name, quantity: 1, price: service.rate }]);
        }
    };

    const updateLineItem = (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeLineItem = (id: string) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };
    
    const { subtotal, taxAmount, total } = useMemo(() => {
        const subtotal = lineItems.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);
        const taxAmount = subtotal * (Number(taxRate) / 100);
        const total = subtotal + taxAmount;
        return { subtotal, taxAmount, total };
    }, [lineItems, taxRate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="client-name">Client Name</Label>
                        <Input id="client-name" placeholder="Acme Inc." value={clientName} onChange={e => setClientName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="client-email">Client Email</Label>
                        <Input id="client-email" type="email" placeholder="contact@acme.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Service Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select onValueChange={addPresetLineItem}>
                        <SelectTrigger>
                            <SelectValue placeholder="Add a preset SYNC service..." />
                        </SelectTrigger>
                        <SelectContent>
                            {SYNC_SERVICES.map(service => (
                                <SelectItem key={service.name} value={service.name}>{service.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Separator />
                    
                    {lineItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-12 space-y-2">
                                <Label htmlFor={`desc-${index}`}>Description</Label>
                                <Input id={`desc-${index}`} placeholder="Service description" value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)} />
                            </div>
                            <div className="col-span-4 space-y-2">
                                <Label htmlFor={`qty-${index}`}>Qty</Label>
                                <Input id={`qty-${index}`} type="number" placeholder="1" value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))} />
                            </div>
                            <div className="col-span-6 space-y-2">
                                <Label htmlFor={`price-${index}`}>Price</Label>
                                <Input id={`price-${index}`} type="number" placeholder="100.00" value={item.price} onChange={e => updateLineItem(item.id, 'price', Number(e.target.value))} />
                            </div>
                            <div className="col-span-2">
                                <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} aria-label="Remove item">
                                    <XCircle className="text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addLineItem} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Item
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Totals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                        <Input id="tax-rate" type="number" placeholder="0" value={taxRate} onChange={e => setTaxRate(Number(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                            <span>{formatCurrency(taxAmount)}</span>
                        </div>
                         <Separator className="my-2"/>
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Invoice Preview</CardTitle>
                </CardHeader>
                <CardContent className="border rounded-lg p-6 space-y-8 bg-background">
                    <div className="flex justify-between items-start">
                        <div>
                            <Logo />
                            <p className="text-muted-foreground text-sm mt-2">SYNC TECH</p>
                            <p className="text-muted-foreground text-sm">123 Tech Avenue, Silicon Valley, CA</p>
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-bold font-headline text-primary">INVOICE</h2>
                             <p className="text-muted-foreground">#INV-001</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-muted-foreground">Bill To:</p>
                        <p className="font-semibold">{clientName || 'Client Name'}</p>
                        <p>{clientEmail || 'client.email@example.com'}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left font-semibold p-2">Item</th>
                                    <th className="text-center font-semibold p-2">Qty</th>
                                    <th className="text-right font-semibold p-2">Price</th>
                                    <th className="text-right font-semibold p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.length > 0 ? lineItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.description}</td>
                                    <td className="text-center p-2">{item.quantity}</td>
                                    <td className="text-right p-2">{formatCurrency(item.price)}</td>
                                    <td className="text-right p-2">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                                )) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted-foreground p-4">No items yet.</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span className="font-headline">Total</span>
                                <span className="font-headline text-primary">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Generate PDF
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
