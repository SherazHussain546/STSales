// src/ai/flows/lead-search.ts
'use server';
/**
 * @fileOverview A lead search AI agent.
 *
 * - leadSearch - A function that handles the lead search process.
 * - LeadSearchInput - The input type for the leadSearch function.
 * - LeadSearchOutput - The return type for the leadSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeadSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  summary: z.string().describe('A brief summary of the company.'),
  techNeeds: z.string().describe('The technology needs of the company.'),
});

export type Lead = z.infer<typeof LeadSchema>;

const LeadSearchInputSchema = z.object({
  industry: z.string().describe('The industry to search for leads in.'),
  location: z.string().describe('The location to search for leads in.'),
});
export type LeadSearchInput = z.infer<typeof LeadSearchInputSchema>;

const LeadSearchOutputSchema = z.object({
  leads: z.array(LeadSchema).describe('An array of leads found.'),
});
export type LeadSearchOutput = z.infer<typeof LeadSearchOutputSchema>;

export async function leadSearch(input: LeadSearchInput): Promise<LeadSearchOutput> {
  return leadSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'leadSearchPrompt',
  input: {schema: LeadSearchInputSchema},
  output: {schema: LeadSearchOutputSchema},
  prompt: `You are a business development expert. Your goal is to find potential leads for SYNC TECH, a technology company.

You will be given an industry and a location. You will search for companies in that industry and location that may need SYNC TECH's services.

Industry: {{{industry}}}
Location: {{{location}}}

Return a JSON array of leads. Each lead should include the company name, a brief summary of the company, and the technology needs of the company.

Make sure the techNeeds focuses on technologies that SYNC TECH can provide.`,
});

const leadSearchFlow = ai.defineFlow(
  {
    name: 'leadSearchFlow',
    inputSchema: LeadSearchInputSchema,
    outputSchema: LeadSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
