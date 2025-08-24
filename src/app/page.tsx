'use client';

import React, { useState } from 'react';
import type { Lead } from '@/ai/flows/lead-search';
import { Header } from '@/components/header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LeadFinder } from '@/components/lead-finder';
import { OutreachGenerator } from '@/components/outreach-generator';
import { InvoiceGenerator } from '@/components/invoice-generator';
import type { Tab } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveTab('outreach');
  };

  const handleBackToLeads = () => {
    setSelectedLead(null);
    setActiveTab('leads');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leads':
        return <LeadFinder leads={leads} setLeads={setLeads} onSelectLead={handleSelectLead} />;
      case 'outreach':
        return <OutreachGenerator lead={selectedLead} onBack={handleBackToLeads} />;
      case 'invoice':
        return <InvoiceGenerator />;
      default:
        return <LeadFinder leads={leads} setLeads={setLeads} onSelectLead={handleSelectLead} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-20 pt-4 px-4">{renderContent()}</main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
