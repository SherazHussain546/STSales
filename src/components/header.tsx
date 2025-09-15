'use client';

import React from 'react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
      <div className="container flex h-16 items-center justify-between max-w-md mx-auto px-4">
        <SidebarTrigger />
        <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
        </div>
        {user ? (
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" /> 
        )}
      </div>
    </header>
  );
}
