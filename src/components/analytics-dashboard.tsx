'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Users, Bookmark, Feather, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Client } from '@/lib/types';

interface AnalyticsData {
  totalClients: number;
  totalLeads: number;
  totalBlogs: number;
  totalBilled: number;
  totalPaid: number;
  totalDue: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const clientsQuery = query(collection(db, 'clients'), where('userId', '==', user.uid));
        const leadsQuery = query(collection(db, 'savedLeads'), where('userId', '==', user.uid));
        const blogsQuery = query(collection(db, 'blogPosts'), where('userId', '==', user.uid));

        const [clientsSnapshot, leadsSnapshot, blogsSnapshot] = await Promise.all([
          getDocs(clientsQuery),
          getDocs(leadsQuery),
          getDocs(blogsQuery),
        ]);

        const clientsData = clientsSnapshot.docs.map(doc => doc.data() as Client);
        
        const totalBilled = clientsData.reduce((acc, client) => acc + (client.totalBilled || 0), 0);
        const totalPaid = clientsData.reduce((acc, client) => acc + (client.totalPaid || 0), 0);

        setData({
          totalClients: clientsSnapshot.size,
          totalLeads: leadsSnapshot.size,
          totalBlogs: blogsSnapshot.size,
          totalBilled,
          totalPaid,
          totalDue: totalBilled - totalPaid,
        });

      } catch (error) {
        console.error("Error fetching analytics data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  const StatCard = ({ title, value, icon: Icon, loading }: { title: string; value: string | number; icon: React.ElementType; loading: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <AreaChart className="text-primary" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Clients" value={data?.totalClients ?? 0} icon={Users} loading={isLoading} />
        <StatCard title="Saved Leads" value={data?.totalLeads ?? 0} icon={Bookmark} loading={isLoading} />
        <StatCard title="Blog Posts" value={data?.totalBlogs ?? 0} icon={Feather} loading={isLoading} />
        <StatCard title="Total Billed" value={formatCurrency(data?.totalBilled ?? 0)} icon={DollarSign} loading={isLoading} />
        <StatCard title="Total Paid" value={formatCurrency(data?.totalPaid ?? 0)} icon={CreditCard} loading={isLoading} />
        <StatCard title="Amount Due" value={formatCurrency(data?.totalDue ?? 0)} icon={AlertCircle} loading={isLoading} />
      </div>
    </div>
  );
}
