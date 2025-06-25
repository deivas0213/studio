'use server';

/**
 * @fileOverview An AI agent that analyzes an image for AI generation and AI enhancements.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  isAiGenerated: z.boolean().describe('Whether or not the image is primarily AI-generated from scratch.'),
  confidenceScore: z.number().describe('The confidence score (0-1) for the primary determination.'),
  isAiImproved: z.boolean().describe('Whether the image appears to be a real photo that has been significantly enhanced or modified by AI.'),
  improvementConfidence: z.number().describe('The confidence score (0-1) that the image has been AI-improved.'),
  explanation: z.string().describe('A brief explanation of the findings, mentioning specific artifacts if any.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert in forensic image analysis, specializing in detecting digital manipulation and AI generation.

Analyze the provided image and determine the following:
1.  **Primary Origin**: Is the image fully AI-generated from scratch? Set 'isAiGenerated' to true if so.
2.  **AI Enhancement**: If the image appears to be a real photograph, determine if it has been significantly enhanced, retouched, or altered using AI tools (e.g., generative fill, deep-learning based filters, AI upscaling). Set 'isAiImproved' to true if you detect such modifications.
3.  **Confidence**: Provide confidence scores for both determinations ('confidenceScore' for primary origin, 'improvementConfidence' for enhancement).
4.  **Explanation**: Provide a brief, one-sentence explanation for your analysis.

If the image is fully AI-generated, 'isAiImproved' should be false. Your primary goal is to distinguish between "generated from scratch" and "an enhanced real photo".

Analyze the following image:

{{media url=photoDataUri}}`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeImagePrompt(input);
    // Ensure that if an image is fully AI generated, it's not also marked as "improved".
    if (output && output.isAiGenerated) {
      output.isAiImproved = false;
      output.improvementConfidence = 0;
    }
    return output!;
  }
);
