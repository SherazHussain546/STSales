'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function ClientManager() {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-muted rounded-full p-3 w-fit">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="font-headline">Client Management</CardTitle>
        <CardDescription>
          This section is under construction. Soon you'll be able to manage your clients here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for future client list and management tools */}
      </CardContent>
    </Card>
  );
}
