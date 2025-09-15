'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Lead } from '@/ai/flows/lead-search';
import { Header } from '@/components/header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LeadFinder } from '@/components/lead-finder';
import { OutreachGenerator } from '@/components/outreach-generator';
import { InvoiceGenerator } from '@/components/invoice-generator';
import { ClientManager } from '@/components/client-manager';
import { SocialsViewer } from '@/components/socials-viewer';
import { BlogGenerator } from '@/components/blog-generator';
import type { Tab } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Search, Mail, FileText, Users, Share2, Feather, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useIsMobile } from '@/hooks/use-mobile';


const navItems = [
  { id: 'leads', label: 'Lead Finder', icon: Search },
  { id: 'outreach', label: 'Outreach', icon: Mail },
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'blog', label: 'Blog', icon: Feather },
  { id: 'socials', label: 'Socials', icon: Share2 },
] as const;


export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };


  if (loading || !user) {
    return null;
  }

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
      case 'clients':
        return <ClientManager />;
      case 'socials':
        return <SocialsViewer />;
      case 'blog':
        return <BlogGenerator />;
      default:
        return <LeadFinder leads={leads} setLeads={setLeads} onSelectLead={handleSelectLead} />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full p-2">
            <div className="p-4 mb-4 flex justify-center">
                <Logo />
            </div>
            <SidebarContent>
                <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                            isActive={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                            tooltip={{
                                children: item.label,
                                side: "right",
                                align: "center",
                            }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarContent>
            <div className="mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
        </div>
      </Sidebar>
      <SidebarInset>
        {isMobile && <Header />}
        <main className="flex-grow pb-20 md:pb-4 pt-4 px-4">
            <div className="max-w-4xl mx-auto">
             {renderContent()}
            </div>
        </main>
        {isMobile && <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />}
      </SidebarInset>
    </SidebarProvider>
  );
}
