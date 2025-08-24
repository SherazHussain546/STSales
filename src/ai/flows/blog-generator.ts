'use server';

/**
 * @fileOverview Generates a blog post based on a given topic.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - BlogGeneratorInput - The input type for the generateBlogPost function.
 * - BlogGeneratorOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlogGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic for the blog post.'),
});

export type BlogGeneratorInput = z.infer<typeof BlogGeneratorInputSchema>;

const BlogGeneratorOutputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format.'),
});

export type BlogGeneratorOutput = z.infer<typeof BlogGeneratorOutputSchema>;

const blogPostPrompt = ai.definePrompt({
  name: 'blogPostPrompt',
  input: {schema: BlogGeneratorInputSchema},
  output: {schema: BlogGeneratorOutputSchema},
  prompt: `You are an expert content creator and SEO specialist. Your task is to write a high-quality, engaging, and well-structured blog post on the given topic.

  Topic: {{{topic}}}

  The blog post should:
  - Have a compelling and SEO-friendly title.
  - Be written in a clear, concise, and professional tone.
  - Be well-organized with headings, subheadings, and paragraphs.
  - Be informative and provide value to the reader.
  - Use Markdown for formatting.

  Output the title and content as separate fields.
  `,
});

const blogPostFlow = ai.defineFlow(
  {
    name: 'blogPostFlow',
    inputSchema: BlogGeneratorInputSchema,
    outputSchema: BlogGeneratorOutputSchema,
  },
  async input => {
    const {output} = await blogPostPrompt(input);
    return output!;
  }
);

/**
 * Generates a blog post for a given topic.
 * @param input - The input containing the blog topic.
 * @returns A promise that resolves to the generated blog post.
 */
export async function generateBlogPost(
  input: BlogGeneratorInput
): Promise<BlogGeneratorOutput> {
  return blogPostFlow(input);
}
