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
  contactName: z.string().optional().describe('The name of a key contact person at the company, like a founder, owner, or manager.'),
  email: z.string().optional().describe('A contact email for the company or the key contact person.'),
  phone: z.string().optional().describe('A contact phone number for the company or the key contact person.'),
  website: z.string().optional().describe('The company\'s website URL. If not available, this should be noted.'),
  notes: z.string().optional().describe('Additional notes on why this is a good lead, especially if they do not have a website or strong online presence.'),
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
  prompt: `You are an elite team of business development analysts for SYNC TECH, a cutting-edge technology solutions provider.

Your mission is to conduct deep-dive research to identify high-quality business leads. Go beyond a surface-level search and uncover actionable intelligence.

Your research for each company must uncover:
1.  A concise summary of the company's mission, offerings, and recent activities.
2.  Specific, evidence-based pain points or challenges they are likely facing (e.g., "outdated customer service portal," "no online booking system," "inefficient manual workflows," "poor social media presence").
3.  How these pain points translate into specific technology needs that SYNC TECH can address.
4.  **Key contact information:** Find a name, email, and phone number for a decision-maker (e.g., owner, founder, manager). If you cannot find direct information, provide general company contact details.
5.  **Website:** Provide the company's website. If they do not have one, explicitly state that and explain in the 'notes' why they are still a valuable lead (e.g., a local restaurant with great reviews but no online ordering).

**Crucially, you must also find promising businesses that may NOT have a website or a strong online presence.** These are often untapped opportunities.

Industry: {{{industry}}}
Location: {{{location}}}

Return a JSON array of leads. Each lead must contain all the discovered information. Be thorough and resourceful.`,
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
