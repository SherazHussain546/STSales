'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2, Users, Trash2, Phone, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  services: z.string().min(5, 'Please describe the services.'),
});

export function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      services: '',
    },
  });

  const fetchClients = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const q = query(collection(db, 'clients'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Client[];
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      toast({
        variant: 'destructive',
        title: 'Error Fetching Clients',
        description: 'Could not load client data from the database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  
  const onSubmit = async (values: z.infer<typeof clientSchema>) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to add a client.' });
        return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'clients'), {
        ...values,
        userId: user.uid,
        totalBilled: 0,
        totalPaid: 0,
      });
      toast({
        title: 'Client Added',
        description: `${values.name} has been successfully added to your client list.`,
      });
      form.reset();
      await fetchClients(); // Refresh the client list
    } catch (error) {
      console.error("Error adding client: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add the client. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClient = async (clientId: string) => {
    try {
        await deleteDoc(doc(db, "clients", clientId));
        toast({
            title: "Client Deleted",
            description: "The client has been removed successfully.",
        });
        await fetchClients(); // Refresh list after deletion
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete the client. Please try again.",
        });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Users className="text-primary" />
            Client Management
          </CardTitle>
          <CardDescription>Add new clients and manage your existing ones.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="add-client" className="border-b-0">
              <AccordionTrigger className="p-3 bg-secondary/30 rounded-md hover:no-underline">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-medium">Add New Client</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="e.g., Acme Corporation" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Client Email</FormLabel><FormControl><Input placeholder="e.g., contact@acme.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., (123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="services" render={({ field }) => ( <FormItem><FormLabel>Services Provided</FormLabel><FormControl><Textarea placeholder="e.g., AI Chatbot Integration, Cloud Migration" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {isSubmitting ? 'Adding...' : 'Add Client'}
                    </Button>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map(client => (
                <Card key={client.id} className="bg-card/50">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline text-lg">{client.name}</CardTitle>
                                <CardDescription>{client.email}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="text-muted-foreground" /> <span>{client.phone}</span>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Briefcase /> Services</Label>
                            <p className="text-sm p-2 bg-secondary/30 rounded-md">{client.services}</p>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">Financials</Label>
                            <div className="flex justify-between items-center text-sm">
                                <Badge variant="secondary">Billed: {formatCurrency(client.totalBilled)}</Badge>
                                <Badge className="bg-green-600/20 text-green-400 border-green-600/50">Paid: {formatCurrency(client.totalPaid)}</Badge>
                                <Badge variant="destructive">Due: {formatCurrency(client.totalBilled - client.totalPaid)}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-4">
              <Users className="h-10 w-10" />
              <p>You haven't added any clients yet.</p>
              <p className="text-sm">Use the form above to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
