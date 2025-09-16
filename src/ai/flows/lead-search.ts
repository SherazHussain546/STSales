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
  website: z.string().optional().describe("The company's website URL. If not available, this should be noted."),
  address: z.string().optional().describe("The physical address of the business, if available."),
  rating: z.number().optional().describe("The business's rating, for example, from Google Maps reviews (on a scale of 1-5)."),
  reviews: z.string().optional().describe("A brief summary of customer reviews, if available."),
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
  prompt: `You are an elite team of business development analysts for SYNC TECH, a cutting-edge technology solutions provider. You have access to a vast knowledge base that includes information similar to that found on Google Maps and other business directories.

Your mission is to conduct deep-dive research to identify high-quality business leads in the specified industry and location. Go beyond a surface-level web search and uncover actionable intelligence, paying special attention to local businesses.

**Your Search Strategy:**
1.  **Simulate a Local Search:** Act as if you are searching Google Maps for businesses in the area. Look for businesses that fit the industry criteria, including those with physical locations like restaurants, clinics, retail stores, etc.
2.  **Identify "Hidden Gems":** Crucially, you must find promising businesses that may NOT have a website or a strong online presence. These are often untapped opportunities. A business with good reviews but no website is a prime target.
3.  **Gather Comprehensive Data:** For each potential lead, your research must uncover:
    *   A concise summary of what the company does and its recent activities.
    *   Specific, evidence-based pain points (e.g., "outdated customer service portal," "no online booking system," "positive reviews but no website for online ordering," "poor social media presence").
    *   How these pain points translate into specific technology needs that SYNC TECH can address.
    *   **Key Contact Information:** Find a name, email, and phone number for a decision-maker (e.g., owner, founder, manager). If you cannot find direct information, provide general company contact details.
    *   **Website:** Provide the company's website. If they do not have one, explicitly state that and explain in the 'notes' why they are still a valuable lead.
    *   **Location & Local Data:** Provide the physical address, and if available, a summary of customer reviews and an average rating.

**Your Target:**
Industry: {{{industry}}}
Location: {{{location}}}

Return a JSON array of leads. Each lead must contain all the discovered information. Be thorough, resourceful, and think like a local business scout.`,
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
