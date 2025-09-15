'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Copy, Inbox, FileText, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import type { Lead } from '@/ai/flows/lead-search';
import { generateOutreachContent } from '@/ai/flows/outreach-generation';
import type { OutreachContentOutput } from '@/ai/flows/outreach-generation';

type OutreachGeneratorProps = {
  lead: Lead | null;
  onBack: () => void;
};

export function OutreachGenerator({ lead, onBack }: OutreachGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [outreach, setOutreach] = useState<OutreachContentOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (lead) {
      setOutreach(null);
      startTransition(async () => {
        const result = await generateOutreachContent(lead);
        setOutreach(result);
      });
    }
  }, [lead]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} has been copied to your clipboard.`,
    });
  };

  if (!lead) {
    return (
      <Card className="text-center">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
          <CardTitle className="font-headline">No Lead Selected</CardTitle>
          <CardDescription>
            Please go to the Lead Finder tab to discover and select a lead first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go to Lead Finder
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{lead.companyName}</CardTitle>
          <CardDescription>{lead.summary}</CardDescription>
        </CardHeader>
      </Card>

      {isPending && (
         <Card>
            <CardContent className="p-6 flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating outreach content...</p>
            </CardContent>
         </Card>
      )}

      {!isPending && outreach && (
        <Accordion type="single" collapsible defaultValue="email" className="w-full space-y-4">
          <Card>
            <AccordionItem value="email" className="border-b-0">
              <AccordionTrigger className="p-6 font-headline text-lg flex items-center gap-2">
                <Mail className="text-primary"/>
                Generated Cold Email
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground">Subject</p>
                    <p className="font-semibold">{outreach.emailSubject}</p>
                </div>
                <div className="space-y-2 rounded-md border p-4 whitespace-pre-wrap text-sm">
                    {outreach.emailBody}
                </div>
                <Button variant="outline" onClick={() => handleCopy(outreach.emailBody, 'Email Body')}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Email Body
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Card>
          
          <Card>
            <AccordionItem value="proposal" className="border-b-0">
                <AccordionTrigger className="p-6 font-headline text-lg flex items-center gap-2">
                    <FileText className="text-primary"/>
                    Generated Proposal
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 rounded-md border p-4 whitespace-pre-wrap">
                    <div dangerouslySetInnerHTML={{ __html: outreach.proposalOutline.replace(/\\n/g, '<br />') }} />
                </div>
                <Button variant="outline" onClick={() => handleCopy(outreach.proposalOutline, 'Proposal Document')}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Proposal
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>
      )}
    </div>
  );
}
