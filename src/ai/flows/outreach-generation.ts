'use server';

/**
 * @fileOverview Generates personalized outreach content for leads, including cold emails and proposal outlines.
 *
 * - generateOutreachContent - A function that generates outreach content for a given lead.
 * - OutreachContentInput - The input type for the generateOutreachContent function.
 * - OutreachContentOutput - The return type for the generateOutreachContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the outreach content generation.
const OutreachContentInputSchema = z.object({
  companyName: z.string().describe('The name of the company to reach out to.'),
  summary: z.string().describe('A brief summary of the company.'),
  techNeeds: z.string().describe('The identified technology needs of the company.'),
});

export type OutreachContentInput = z.infer<typeof OutreachContentInputSchema>;

// Define the output schema for the outreach content generation.
const OutreachContentOutputSchema = z.object({
  emailSubject: z.string().describe('The subject line for the cold email.'),
  emailBody: z.string().describe('The body of the cold email.'),
  proposalOutline: z.string().describe('An outline for the proposal.'),
});

export type OutreachContentOutput = z.infer<typeof OutreachContentOutputSchema>;

// Define the prompt for generating outreach content.
const outreachContentPrompt = ai.definePrompt({
  name: 'outreachContentPrompt',
  input: {schema: OutreachContentInputSchema},
  output: {schema: OutreachContentOutputSchema},
  prompt: `You are an AI assistant specializing in generating personalized outreach content for sales teams.

  Based on the following information about a potential lead, generate a cold email and a proposal outline.

  Company Name: {{{companyName}}}
  Summary: {{{summary}}}
  Tech Needs: {{{techNeeds}}}

  Cold Email:
  - The email should be concise and engaging, highlighting the value proposition for the lead.
  - Include a clear call to action.

  Proposal Outline:
  - Provide a structured outline for a proposal tailored to the lead's specific needs.
  - Include key sections and points to cover in the proposal.

  Output the email subject, email body, and proposal outline as separate fields.
  `,
});

// Define the Genkit flow for generating outreach content.
const outreachContentFlow = ai.defineFlow(
  {
    name: 'outreachContentFlow',
    inputSchema: OutreachContentInputSchema,
    outputSchema: OutreachContentOutputSchema,
  },
  async input => {
    const {output} = await outreachContentPrompt(input);
    return output!;
  }
);

/**
 * Generates personalized outreach content for a given lead.
 * @param input - The input containing lead information.
 * @returns A promise that resolves to the generated outreach content.
 */
export async function generateOutreachContent(
  input: OutreachContentInput
): Promise<OutreachContentOutput> {
  return outreachContentFlow(input);
}
