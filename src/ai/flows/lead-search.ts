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
  summary: z.string().describe('A brief summary of the company, including its mission and recent activities.'),
  painPoints: z.string().describe("Specific challenges or pain points the company is likely facing that SYNC TECH can solve."),
  techNeeds: z.string().describe('The technology needs of the company, derived from their pain points.'),
});

export type Lead = z.infer<typeof LeadSchema>;

const LeadSearchInputSchema = z.object({
  industry: z.string().describe('The industry to search for leads in.'),
  location: z.string().describe('The location to search for leads in.'),
});
export type LeadSearchInput = z.infer<typeof LeadSearchInputSchema>;

const LeadSearchOutputSchema = z.object({
  leads: z.array(LeadSchema).describe('An array of well-researched leads.'),
});
export type LeadSearchOutput = z.infer<typeof LeadSearchOutputSchema>;

export async function leadSearch(input: LeadSearchInput): Promise<LeadSearchOutput> {
  return leadSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'leadSearchPrompt',
  input: {schema: LeadSearchInputSchema},
  output: {schema: LeadSearchOutputSchema},
  prompt: `You are a team of expert business development analysts for SYNC TECH, a cutting-edge technology solutions provider.

Your mission is to conduct deep-dive research to identify high-quality business leads. Go beyond a surface-level search.

Your research for each company must uncover:
1.  A concise summary of the company's mission and recent activities.
2.  Specific, evidence-based pain points or challenges they are likely facing. (e.g., "outdated customer service portal," "struggling with data integration," "inefficient manual workflows").
3.  How these pain points translate into specific technology needs that SYNC TECH can address.

Industry: {{{industry}}}
Location: {{{location}}}

Return a JSON array of leads. Each lead must contain the company name, a comprehensive summary, their specific pain points, and their resulting technology needs.`,
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
