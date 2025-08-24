import React from 'react';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-center max-w-md mx-auto">
        <Logo />
      </div>
    </header>
  );
}
