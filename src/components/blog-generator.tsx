'use client';

import React, { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { generateBlogPost } from '@/ai/flows/blog-generator';
import type { BlogGeneratorOutput } from '@/ai/flows/blog-generator';
import { Loader2, Feather, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Topic must be at least 5 characters.' }),
});

export function BlogGenerator() {
  const [isPending, startTransition] = useTransition();
  const [blogPost, setBlogPost] = useState<BlogGeneratorOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to generate a blog post.',
      });
      return;
    }
    setBlogPost(null);
    startTransition(async () => {
      try {
        const result = await generateBlogPost(values);
        setBlogPost(result);
        
        // Save to Firestore for analytics
        await addDoc(collection(db, 'blogPosts'), {
          userId: user.uid,
          topic: values.topic,
          title: result.title,
          createdAt: serverTimestamp(),
        });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'An error occurred while generating the blog post.',
        });
      }
    });
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Feather className="text-primary" />
            AI Blog Post Generator
          </CardTitle>
          <CardDescription>Create engaging blog content in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'The Future of AI in Sales'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? 'Generating...' : 'Generate Blog Post'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isPending && (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
            </CardContent>
        </Card>
      )}

      {blogPost && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">{blogPost.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md border p-4">
                {blogPost.content}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handleCopy(blogPost.content, 'Blog Content')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
