'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/client';
import type { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
});

export function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const user = auth.currentUser;

  const fetchClients = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, 'clients'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Client[];
      setClients(clientsData);
    } catch (error) {
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
        services: [],
        totalBilled: 0,
        totalPaid: 0,
        projectStatus: 0,
      });
      toast({
        title: 'Client Added',
        description: `${values.name} has been successfully added to your client list.`,
      });
      form.reset();
      fetchClients(); // Refresh the client list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add the client. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

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
          <Accordion type="single" collapsible>
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., contact@acme.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <CardTitle className="font-headline text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                        <Label className="text-xs text-muted-foreground">Project Progress</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={client.projectStatus} className="w-full h-2" />
                            <span className="text-sm font-semibold">{client.projectStatus}%</span>
                        </div>
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
                   <CardFooter>
                        <Button variant="outline" className="w-full">Generate Invoice for Due Amount</Button>
                  </CardFooter>
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
