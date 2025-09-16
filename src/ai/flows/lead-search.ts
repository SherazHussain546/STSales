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
  leads: z.array(LeadSchema).describe('An array of at least 20 well-researched leads.'),
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

Your mission is to conduct deep-dive research to identify **at least 20 high-quality business leads** in the specified industry and location. Go beyond a surface-level web search and uncover actionable intelligence.

**Your Search Priorities:**
1.  **Prioritize New and Underperforming Businesses:** Your primary goal is to find businesses that have the most to gain from SYNC TECH's services. Look for indicators that a business is new, struggling, or digitally underserved. This includes:
    *   Newly opened establishments.
    *   Businesses with low ratings or negative reviews that mention operational issues (e.g., "long wait times," "difficult to book," "outdated website").
    *   Companies with a minimal or non-existent online presence (e.g., no website, inactive social media).
2.  **Simulate a Local Search:** Act as if you are searching Google Maps for businesses in the area. Look for businesses that fit the industry criteria, including those with physical locations like restaurants, clinics, retail stores, etc.
3.  **Identify "Hidden Gems":** Crucially, you must find promising businesses that may NOT have a website. A business with good reviews but no website is a prime target because they have a proven service but are missing a key revenue channel.
4.  **Gather Comprehensive Data:** For each potential lead, your research must uncover:
    *   A concise summary of what the company does and its current situation.
    *   Specific, evidence-based pain points (e.g., "no online booking system to manage appointments," "positive reviews indicate a loyal customer base, but they lack a website for online ordering," "poor social media engagement is costing them visibility").
    *   How these pain points translate into specific technology needs (e.g., "needs a modern website with an e-commerce module," "requires a customer relationship management (CRM) system").
    *   **Key Contact Information:** Find a name, email, and phone number for a decision-maker (e.g., owner, founder, manager). If you cannot find direct information, provide general company contact details.
    *   **Website:** Provide the company's website. If they do not have one, explicitly state that and explain in the 'notes' why they are still a valuable lead.
    *   **Location & Local Data:** Provide the physical address, and if available, a summary of customer reviews and an average rating.

**Your Target:**
Industry: {{{industry}}}
Location: {{{location}}}

Return a JSON array of **at least 20 leads**. Each lead must contain all the discovered information. Be thorough, resourceful, and think like a local business scout hungry for opportunity.`,
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
