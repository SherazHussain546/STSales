'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import type { Lead } from '@/ai/flows/lead-search';
import type { SavedLead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HeartCrack, Bookmark, Zap, Users, Mail, Phone, Globe, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedLeadsProps {
  onSelectLead: (lead: Lead) => void;
}

export function SavedLeads({ onSelectLead }: SavedLeadsProps) {
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedLeads = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const q = query(collection(db, 'savedLeads'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SavedLead[];
      setSavedLeads(leadsData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Fetching Leads',
        description: 'Could not load saved leads.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedLeads();
    }
  }, [user]);

  const handleUnsaveLead = async (leadId: string) => {
    try {
      await deleteDoc(doc(db, 'savedLeads', leadId));
      toast({ title: 'Lead Unsaved', description: 'The lead has been removed from your saved list.' });
      await fetchSavedLeads(); // Refresh list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to unsave the lead. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bookmark className="text-primary" />
            Saved Leads
          </CardTitle>
          <CardDescription>Your curated list of promising leads to follow up on.</CardDescription>
        </CardHeader>
      </Card>

      {savedLeads.length > 0 ? (
        <div className="space-y-4">
          {savedLeads.map(lead => (
            <Card key={lead.id}>
              <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">{lead.companyName}</CardTitle>
                        {lead.address && <CardDescription>{lead.address}</CardDescription>}
                    </div>
                    {lead.rating && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span>{lead.rating.toFixed(1)}</span>
                        </Badge>
                    )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {lead.contactName && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> <span>{lead.contactName}</span></div>}
                    {lead.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></div>}
                    {lead.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{lead.phone}</span></div>}
                    {lead.website && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{lead.website}</a></div>}
                </div>
                 <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Zap className="text-destructive"/> Pain Points:</p>
                    <p className="text-sm text-muted-foreground">{lead.painPoints}</p>
                </div>
                 {lead.reviews && (
                  <div>
                      <p className="text-sm font-semibold mb-2">Review Summary:</p>
                      <p className="text-sm text-muted-foreground">{lead.reviews}</p>
                  </div>
                )}
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
                <Button variant="destructive" size="icon" onClick={() => handleUnsaveLead(lead.id)}>
                  <HeartCrack className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
              <Bookmark className="h-10 w-10" />
              <p className="font-medium">You haven't saved any leads yet.</p>
              <p className="text-sm">Find new opportunities in the "Lead Finder" tab and click the heart icon to save them here.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
