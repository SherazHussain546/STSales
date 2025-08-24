'use client';

import React from 'react';
import { Search, Mail, FileText } from 'lucide-react';
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
] as const;

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'flex flex-col items-center h-auto px-4 py-2 text-xs font-normal gap-1',
              activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </footer>
  );
}
