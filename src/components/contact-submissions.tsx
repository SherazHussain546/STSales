'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import type { ContactSubmission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Inbox, Mail, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
      setSubmissions(subs);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching submissions: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    const submissionRef = doc(db, 'contactSubmissions', id);
    try {
      await updateDoc(submissionRef, { status: 'read' });
    } catch (error) {
      console.error("Error updating submission status: ", error);
    }
  };

  const formatDate = (timestamp: ContactSubmission['createdAt']) => {
    if (!timestamp) return 'No date';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
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
            <MessageSquare className="text-primary" />
            Contact Form Submissions
          </CardTitle>
          <CardDescription>Messages from your synctech.ie contact form.</CardDescription>
        </CardHeader>
      </Card>

      {submissions.length > 0 ? (
        <Accordion type="multiple" className="space-y-4">
          {submissions.map(sub => (
            <AccordionItem value={sub.id} key={sub.id} className="border-b-0">
               <Card className="bg-card/50">
                <AccordionTrigger 
                  className="p-4 hover:no-underline"
                  onClick={() => sub.status === 'new' && handleMarkAsRead(sub.id)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4 text-left">
                       {sub.status === 'new' ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                       ) : (
                        <div className="h-2.5 w-2.5" />
                       )}
                       <div>
                          <p className="font-medium">{sub.name}</p>
                          <p className="text-sm text-muted-foreground">{sub.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-muted-foreground hidden md:block">{formatDate(sub.createdAt)}</p>
                      {sub.status === 'new' && <Badge variant="default">New</Badge>}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-2">
                  <p className="whitespace-pre-wrap rounded-md bg-secondary/30 p-4">{sub.message}</p>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
            <CardContent className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
              <Inbox className="h-10 w-10" />
              <p className="font-medium">No submissions yet.</p>
              <p className="text-sm">New messages from your website will appear here.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
