'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Briefcase, MapPin, Loader2, Wand2, Zap, Heart, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { leadSearch } from '@/ai/flows/lead-search';
import type { Lead } from '@/ai/flows/lead-search';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';


const formSchema = z.object({
  industry: z.string().min(3, { message: 'Industry must be at least 3 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
});

type LeadFinderProps = {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  onSelectLead: (lead: Lead) => void;
};

export function LeadFinder({ leads, setLeads, onSelectLead }: LeadFinderProps) {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: 'SaaS',
      location: 'San Francisco, CA',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const result = await leadSearch(values);
      setLeads(result.leads);
    });
  };

  const handleSaveLead = async (lead: Lead) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to save a lead.',
      });
      return;
    }
    try {
      await addDoc(collection(db, 'savedLeads'), {
        ...lead,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Lead Saved!',
        description: `${lead.companyName} has been saved to your list.`,
      });
    } catch (error) {
      console.error("Error saving lead: ", error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Lead',
        description: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Lead Finder
          </CardTitle>
          <CardDescription>Discover new business opportunities with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., Technology, Healthcare" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., New York, NY" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Find Leads'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isPending && (
        <div className="space-y-4">
           {[...Array(3)].map((_, i) => (
             <Card key={i} className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
             </Card>
           ))}
        </div>
      )}

      {!isPending && leads.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-headline text-xl">Potential Leads</h2>
          {leads.map((lead, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-headline">{lead.companyName}</CardTitle>
                <CardDescription>{lead.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {lead.contactName && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> <span>{lead.contactName}</span></div>}
                    {lead.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{lead.email}</span></div>}
                    {lead.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{lead.phone}</span></div>}
                    {lead.website && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{lead.website}</a></div>}
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Zap className="text-destructive"/> Pain Points:</p>
                    <p className="text-sm text-muted-foreground">{lead.painPoints}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2">Tech Needs:</p>
                    <p className="text-sm text-muted-foreground">{lead.techNeeds}</p>
                </div>
                {lead.notes && (
                  <div>
                      <p className="text-sm font-semibold mb-2">Analyst Notes:</p>
                      <p className="text-sm text-muted-foreground">{lead.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                <Button className="w-full" onClick={() => onSelectLead(lead)}>
                  Generate Outreach
                </Button>
                 <Button variant="outline" size="icon" onClick={() => handleSaveLead(lead)}>
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
