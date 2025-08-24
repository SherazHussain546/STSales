'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Facebook, Instagram, Share2, Rss } from 'lucide-react';

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
];

export function SocialsViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Share2 className="text-primary" />
          Our Socials
        </CardTitle>
        <CardDescription>Connect with us on our social media platforms.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full justify-start">
              <link.icon className="mr-4" />
              <span>{link.name}</span>
            </Button>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
