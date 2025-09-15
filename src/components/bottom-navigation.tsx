'use client';

import React from 'react';
import { Search, Mail, FileText, Users, Share2, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Tab } from '@/lib/types';

interface BottomNavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const navItems = [
  { id: 'leads', label: 'Lead Finder', icon: Search },
  { id: 'outreach', label: 'Outreach', icon: Mail },
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'blog', label: 'Blog', icon: Feather },
  { id: 'socials', label: 'Socials', icon: Share2 },
] as const;

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center p-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'flex flex-col items-center h-auto px-2 py-2 text-xs font-normal gap-1 w-[calc(100%/6)] rounded-md hover:bg-primary hover:text-primary-foreground',
              activeTab === item.id ? 'bg-primary/90 text-primary-foreground' : 'text-muted-foreground'
            )}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-center leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </footer>
  );
}
