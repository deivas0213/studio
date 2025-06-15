'use server';

/**
 * @fileOverview Generates usage insights based on user's historical data.
 *
 * - getUsageInsights - A function that generates usage insights.
 * - UsageInsightsInput - The input type for the getUsageInsights function.
 * - UsageInsightsOutput - The return type for the getUsageInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UsageInsightsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  uploadHistory: z
    .array(z.object({
      isAiGenerated: z.boolean(),
      timestamp: z.string(), // ISO timestamp
    }))
    .describe('The user upload history.'),
});
export type UsageInsightsInput = z.infer<typeof UsageInsightsInputSchema>;

const UsageInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated usage insights.'),
});
export type UsageInsightsOutput = z.infer<typeof UsageInsightsOutputSchema>;

export async function getUsageInsights(input: UsageInsightsInput): Promise<UsageInsightsOutput> {
  return getUsageInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'usageInsightsPrompt',
  input: {schema: UsageInsightsInputSchema},
  output: {schema: UsageInsightsOutputSchema},
  prompt: `You are an AI assistant that provides insights to users about their media consumption habits based on the following data.

User ID: {{{userId}}}
Upload History:{{#each uploadHistory}}\n- {{timestamp}}: {{#if isAiGenerated}}AI-generated{{else}}Real{{/if}}{{/each}}

Analyze the upload history and provide a summary of the user's ratio of real versus AI uploads, highlighting any trends or patterns in their media consumption habits.
Keep the insights concise and easy to understand for the user.`,
});

const getUsageInsightsFlow = ai.defineFlow(
  {
    name: 'getUsageInsightsFlow',
    inputSchema: UsageInsightsInputSchema,
    outputSchema: UsageInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
