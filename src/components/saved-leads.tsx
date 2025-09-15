'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import type { SavedLead, Lead } from '@/ai/flows/lead-search';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HeartCrack, Bookmark, Zap } from 'lucide-react';

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
    fetchSavedLeads();
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
                <CardTitle className="font-headline">{lead.companyName}</CardTitle>
                <CardDescription>{lead.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Zap className="text-destructive"/> Pain Points:</p>
                    <p className="text-sm text-muted-foreground">{lead.painPoints}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2">Tech Needs:</p>
                    <p className="text-sm text-muted-foreground">{lead.techNeeds}</p>
                </div>
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
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-4">
          <Bookmark className="h-10 w-10" />
          <p>You haven't saved any leads yet.</p>
          <p className="text-sm">Click the heart icon on a lead in the Lead Finder to save it here.</p>
        </div>
      )}
    </div>
  );
}
