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
  painPoints: z.string().describe("The company's identified challenges and pain points."),
  techNeeds: z.string().describe('The identified technology needs of the company.'),
});

export type OutreachContentInput = z.infer<typeof OutreachContentInputSchema>;

// Define the output schema for the outreach content generation.
const OutreachContentOutputSchema = z.object({
  emailSubject: z.string().describe('The subject line for the cold email.'),
  emailBody: z.string().describe('The body of the cold email.'),
  proposalOutline: z.string().describe('A complete, client-ready proposal in Markdown format.'),
});

export type OutreachContentOutput = z.infer<typeof OutreachContentOutputSchema>;

// Define the prompt for generating outreach content.
const outreachContentPrompt = ai.definePrompt({
  name: 'outreachContentPrompt',
  input: {schema: OutreachContentInputSchema},
  output: {schema: OutreachContentOutputSchema},
  prompt: `You are an AI assistant specializing in crafting compelling, client-ready sales documents for a tech company named SYNC TECH.

Based on the provided lead information, generate:
1.  A concise, attention-grabbing cold email.
2.  A complete, professional proposal document in Markdown format, ready to be copied and sent to the client.

**Lead Information:**
- Company Name: {{{companyName}}}
- Summary: {{{summary}}}
- Identified Pain Points: {{{painPoints}}}
- Technology Needs: {{{techNeeds}}}

---

**1. Cold Email:**
- The email should be concise and engaging, highlighting the value proposition for the lead.
- Reference their specific pain points to show you've done your research.
- Include a clear call to action (e.g., scheduling a brief call).

---

**2. Professional Proposal Document (Markdown Format):**
Generate a full proposal document using Markdown for formatting. It must be well-structured, professional, and persuasive. Include the following sections:

- **Cover Letter:** A brief, personalized introduction.
- **Executive Summary:** A high-level overview of the client's challenges and the proposed solution's value.
- **Understanding Your Needs:** A section that details the pain points ({{{painPoints}}}) to show you understand their situation.
- **Proposed Solutions:** A detailed breakdown of the solutions SYNC TECH will provide to address each pain point.
- **Project Timeline:** A sample high-level timeline.
- **Pricing:** A sample pricing table (use realistic placeholder values).
- **About SYNC TECH:** A brief company bio.
- **Next Steps:** A clear call to action.

Output the email subject, email body, and the complete Markdown proposal as separate fields.
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
