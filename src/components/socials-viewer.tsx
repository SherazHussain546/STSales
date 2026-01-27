'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Facebook, Instagram, Share2, Rss, Briefcase, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/SYNC-TECH-Solutions',
    icon: Github,
  },
  {
    name: 'Blogger',
    url: 'https://www.blogger.com/blog/posts/6999647731806944149',
    icon: Rss,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/synctechie/',
    icon: Linkedin,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/synctech.ie/',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/synctech.ie',
    icon: Facebook,
  },
  {
    name: 'Fiverr',
    url: 'https://www.fiverr.com/synctechie/',
    icon: Briefcase,
  },
  {
    name: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~01d3a189ece07667f4',
    icon: Briefcase,
  },
  {
    name: 'PeoplePerHour',
    url: 'https://www.peopleperhour.com/freelancer/sync_tech-solutions-programmer-zymajmyx',
    icon: Briefcase,
  },
  {
    name: 'Freelancer.ie',
    url: 'https://www.freelancer.ie/u/synctechie',
    icon: Briefcase,
  },
];

export function SocialsViewer() {
    const { toast } = useToast();

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({
        title: 'Link Copied!',
        description: 'The link has been copied to your clipboard.',
        });
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Share2 className="text-primary" />
          Our Socials
        </CardTitle>
        <CardDescription>Connect with us on our social media platforms.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {socialLinks.map((link) => (
          <div key={link.name} className="flex items-center justify-between rounded-lg border p-3">
             <div className="flex items-center gap-3">
                <link.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{link.name}</span>
             </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopy(link.url)}>
                    <LinkIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                </Button>
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                    </Button>
                </a>
             </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
